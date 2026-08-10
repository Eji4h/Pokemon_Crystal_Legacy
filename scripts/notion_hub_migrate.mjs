#!/usr/bin/env node
/**
 * Notion hub reorg migration helper.
 * Requires NOTION_API_KEY env (integration token with page access).
 * Usage: NOTION_API_KEY=secret_... node scripts/notion_hub_migrate.mjs [--dry-run] [--segment map|badge1|...|all]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HUB = "3b7da311-a58e-80c2-b287-de7ce0dc63fd";
const ids = JSON.parse(
  fs.readFileSync(path.join(root, "docs/superpowers/artifacts/notion-child-ids.json"), "utf8"),
);

const SEGMENTS = {
  map: {
    dest: ids.pages.map,
    start: "b4a62d77-4a42-4256-aff2-647a51e536ce",
    end: "420b719d-e015-4a57-aa66-46e7fa806bc1",
    skipTypes: new Set(["child_page"]),
  },
  badge1: {
    dest: ids.pages.badge1,
    start: "b866213a-9183-4e88-8016-4a8b8a4b2cee",
    end: "8af89dfb-26f1-4155-8d62-eafd67524141",
    goal: "Violet Gym → Zephyr Badge",
    prereq: "—",
  },
  badge2: {
    dest: ids.pages.badge2,
    start: "8af89dfb-26f1-4155-8d62-eafd67524141",
    end: "65e704e1-4583-47e3-9667-28031d03ee62",
    goal: "Azalea Gym → Hive Badge",
    prereq: "—",
  },
  badge3: {
    dest: ids.pages.badge3,
    start: "65e704e1-4583-47e3-9667-28031d03ee62",
    end: "17c45dfa-4d67-4c76-b3de-9b4b5cb16340",
    goal: "Goldenrod Gym → Plain Badge",
    prereq: "HM01 Cut",
  },
  badge4: {
    dest: ids.pages.badge4,
    start: "f907ec23-e77d-4de6-8ce1-f5e44582df44",
    end: "7f354a5d-25ac-4b9a-82f9-79b14a0a78a3",
    goal: "Ecruteak Gym → Fog Badge",
    prereq: "Squirtbottle",
  },
  badge5: {
    dest: ids.pages.badge5,
    start: "7f354a5d-25ac-4b9a-82f9-79b14a0a78a3",
    end: "34077171-c93c-403e-b42a-a6d6b95dfdd6",
    goal: "Cianwood Gym → Storm Badge",
    prereq: "—",
    note: "รอบกลับ Olivine / Jasmine → ดู Badge 6",
  },
  badge6: {
    dest: ids.pages.badge6,
    start: "34077171-c93c-403e-b42a-a6d6b95dfdd6",
    end: "58fb04ca-4349-408a-9efd-ee328b7541bb",
    goal: "Olivine Gym → Mineral Badge",
    prereq: "—",
    note: "เส้นทางมาถึงจาก Badge 5 (Cianwood)",
  },
  badge7: {
    dest: ids.pages.badge7,
    start: "58fb04ca-4349-408a-9efd-ee328b7541bb",
    end: "08ed7df6-7683-49f8-b5b1-217619661760",
    goal: "Mahogany Gym → Glacier Badge",
    prereq: "—",
  },
  badge8: {
    dest: ids.pages.badge8,
    start: "08ed7df6-7683-49f8-b5b1-217619661760",
    end: "502f9478-8602-4772-a491-b7c30f7759a9",
    goal: "Blackthorn Gym → Rising Badge",
    prereq: "Radio Tower cleared",
  },
  league: {
    dest: ids.pages.league,
    start: "502f9478-8602-4772-a491-b7c30f7759a9",
    end: "179c1f12-414c-4820-b7fb-18cac19c317d",
    goal: "Pokémon League → Champion",
    prereq: "All 8 badges",
  },
};

const token = process.env.NOTION_API_KEY;
const dryRun = process.argv.includes("--dry-run");
const segArg = process.argv.find((a) => a.startsWith("--segment="))?.split("=")[1] ?? "all";

if (!token) {
  console.error("NOTION_API_KEY required");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Notion-Version": "2025-09-03",
  "Content-Type": "application/json",
};

async function notion(path, opts = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, { ...opts, headers });
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${path}: ${JSON.stringify(body)}`);
  return body;
}

async function listChildren(blockId) {
  const out = [];
  let cursor;
  do {
    const q = new URLSearchParams({ page_size: "100" });
    if (cursor) q.set("start_cursor", cursor);
    const data = await notion(`/blocks/${blockId}/children?${q}`);
    out.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return out;
}

function blockToCreate(block) {
  const { type, id: _id, created_time: _c, last_edited_time: _l, created_by: _cb, last_edited_by: _lb, parent: _p, archived: _a, has_children: _hc, in_trash: _t, object: _o, request_id: _r, ...rest } = block;
  if (!type || type === "unsupported") return null;
  const payload = { type, [type]: rest[type] };
  if (type === "child_page" || type === "child_database") return null;
  return payload;
}

async function copyBlockTree(block, destPageId) {
  const create = blockToCreate(block);
  if (!create) return null;
  if (dryRun) {
    console.log(`  [dry] copy ${block.type} ${block.id}`);
    return block.id;
  }
  const data = await notion(`/blocks/${destPageId}/children`, {
    method: "PATCH",
    body: JSON.stringify({ children: [create] }),
  });
  const newId = data.results[0].id;
  if (block.has_children) {
    const kids = await listChildren(block.id);
    for (const kid of kids) await copyBlockTree(kid, newId);
  }
  return newId;
}

async function archiveBlock(blockId) {
  if (dryRun) return console.log(`  [dry] archive ${blockId}`);
  await notion(`/blocks/${blockId}`, { method: "PATCH", body: JSON.stringify({ archived: true }) });
}

async function migrateSegment(name, seg) {
  console.log(`\n=== ${name} → ${seg.dest} ===`);
  const hubBlocks = await listChildren(HUB);
  const si = hubBlocks.findIndex((b) => b.id === seg.start);
  const ei = hubBlocks.findIndex((b) => b.id === seg.end);
  if (si < 0 || ei < 0) throw new Error(`segment bounds not found for ${name}`);
  const slice = hubBlocks.slice(si, ei);
  for (const b of slice) {
    if (seg.skipTypes?.has(b.type)) continue;
    await copyBlockTree(b, seg.dest);
    await archiveBlock(b.id);
  }
  console.log(`done ${name}: ${slice.length} top-level blocks`);
}

const run = segArg === "all" ? Object.keys(SEGMENTS) : [segArg];
for (const name of run) {
  if (!SEGMENTS[name]) throw new Error(`unknown segment ${name}`);
  await migrateSegment(name, SEGMENTS[name]);
}
