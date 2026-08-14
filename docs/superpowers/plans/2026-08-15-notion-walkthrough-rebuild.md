# Notion Walkthrough Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Archive the old Pokemon Notion hub as a sibling `Archive` page, create a new thin hub + Johto/Kanto pages, put 16 Johto Part toggles on Johto, and fill Parts 1–3 from Bulbapedia (Thai narrative + checklist) with Legacy overlays verified in this repo.

**Architecture:** Lock toggle titles, Part URLs, tag colors, and required Legacy strings in `scripts/notion_johto_outline.mjs` (unit-tested). Create new Notion pages via MCP; **move** the old hub under Archive (do not delete or rewrite old blocks). Append toggle children in Notion. After each filled Part, dump toggle plain text and assert required strings.

**Tech Stack:** Notion MCP (`user-Notion Ej!4h`; authenticate if needed), Node.js `assert` tests (no new deps), Bulbapedia Crystal walkthrough, Official Google Doc digest + `data/trainers/parties.asm` / maps. Spec: `docs/superpowers/specs/2026-08-15-notion-walkthrough-rebuild-design.md`

## Global Constraints

- Spec is source of truth: `docs/superpowers/specs/2026-08-15-notion-walkthrough-rebuild-design.md`
- Old hub id (must survive under Archive): `3b7da311-a58e-80c2-b287-de7ce0dc63fd`
- Old children: map `3b8da311-a58e-819f-b27c-eb97dbaca47b`, johto `3b8da311-a58e-811f-92dd-cdb621adacd4`
- New hub = **new page** (new UUID). Never wipe the old hub in place
- Archive = sibling of new hub; **move** old hub into Archive; do not use Notion’s built-in Archive; do not delete
- Story source: https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal — Part N = `.../Part_N`
- Thai prose + English in-game names; translate **narrative and** steps
- Do not copy Bulbapedia wild % tables or route-trainer parties
- Doc vs repo: believe repo + `[Repo check]`; Legacy diffs + `[Legacy ต่าง]`
- Tag colors: split tag/body spans — `[EVENT]` blue bold, `[ปริศนา]` orange bold, `[สำคัญ]` brown bold, `[Legacy ต่าง]`/`[Legacy]` red bold, `[เสริม]` green bold, `[Repo check]` purple bold; body `color: "default"`
- This plan = Milestone A + B only (Parts 4–15 and Kanto body are a later plan)
- Do not commit unless the user asks; commit steps below are checkpoints only
- After local script/doc edits: `graphify update .`
- Before ROM greps: `graphify query` first
- MCP: `GetMcpTools` on `user-Notion Ej!4h` (or `user-Notion Ej!4h (API token)` if listed). If `needsAuth`, `CallMcpTool` `mcp_auth` then re-fetch schemas. Map payloads below onto create-page / move-page / append-block-children / get-block-children / retrieve-page tools

### Notion tagged bullet payload

Use this exact `rich_text` shape (produced by `taggedRichText` in the outline script):

```json
{
  "type": "bulleted_list_item",
  "bulleted_list_item": {
    "rich_text": [
      {
        "type": "text",
        "text": { "content": "[EVENT]" },
        "annotations": { "bold": true, "color": "blue" }
      },
      {
        "type": "text",
        "text": { "content": " body starts with a space then Thai/English" },
        "annotations": { "color": "default" }
      }
    ]
  }
}
```

### Fill Part protocol (Tasks 5–7 instantiate this)

1. `ctx_fetch_and_index` the Part URL from `JOHTO_TOGGLES[n].source`. If HTTP error: **stop that Part**; do not invent plot.
2. Translate the Part to Thai: town/route mood, NPC and Team Rocket beats, and what to do. Keep Pokémon/move/item/badge/NPC names in English.
3. Prepend Checklist using `taggedRichText` + the **Required checklist** list in that task (do not skip those bullets).
4. Append under the existing toggle block (do not create a second toggle with the same title): source paragraph → heading Checklist → bullets → heading เนื้อเรื่อง → paragraphs.
5. Write dump file from retrieved toggle plain text; run that task’s dump asserts.
6. If a Legacy number is not in the required list, grep repo (`parties.asm`, `maps/`) before writing it.

## File map

| Path | Role |
|---|---|
| `docs/superpowers/specs/2026-08-15-notion-walkthrough-rebuild-design.md` | Approved design (read-only during impl) |
| `scripts/notion_johto_outline.mjs` | Toggle list, tag helper, required dump needles |
| `scripts/notion_johto_outline.test.mjs` | Schema + tag-span tests |
| `docs/superpowers/artifacts/notion-rebuild-ids.json` | New/old page and toggle block ids |
| `docs/superpowers/artifacts/johto-part-01-dump.txt` | Part 1 toggle plain text for asserts |
| `docs/superpowers/artifacts/johto-part-02-dump.txt` | Part 2 |
| `docs/superpowers/artifacts/johto-part-03-dump.txt` | Part 3 |
| `.cursor/rules/pokemon-crystal-legacy.mdc` | Point hub URL/ID at the **new** hub after Task 3 |
| Notion (runtime) | Archive, new hub, Johto, Kanto |

---

### Task 1: Johto outline module + tests

**Files:**
- Create: `scripts/notion_johto_outline.mjs`
- Create: `scripts/notion_johto_outline.test.mjs`

**Interfaces:**
- Consumes: nothing (constants from spec)
- Produces: `JOHTO_TOGGLES` (length 16), `TAG_COLORS`, `taggedRichText(tag, body)`, `PART_REQUIRED`, `HUB_QOL_REQUIRED`, `OLD_IDS`

- [ ] **Step 1: Write the failing test**

Create `scripts/notion_johto_outline.test.mjs`:

```js
import assert from "node:assert/strict";
import {
  JOHTO_TOGGLES,
  TAG_COLORS,
  taggedRichText,
  PART_REQUIRED,
  HUB_QOL_REQUIRED,
  OLD_IDS,
} from "./notion_johto_outline.mjs";

assert.equal(JOHTO_TOGGLES.length, 16);
assert.equal(JOHTO_TOGGLES[0].id, "part1");
assert.equal(JOHTO_TOGGLES[0].title, "New Bark (Part 1)");
assert.equal(
  JOHTO_TOGGLES[0].source,
  "https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal/Part_1",
);
assert.equal(JOHTO_TOGGLES[14].id, "part15");
assert.equal(JOHTO_TOGGLES[14].title, "Indigo Plateau (Part 15)");
assert.equal(JOHTO_TOGGLES[15].id, "postgame_johto");
assert.equal(JOHTO_TOGGLES[15].source, null);

for (let n = 1; n <= 15; n++) {
  const t = JOHTO_TOGGLES[n - 1];
  assert.equal(t.id, `part${n}`);
  assert.match(t.source, new RegExp(`/Part_${n}$`));
}

assert.equal(TAG_COLORS["[EVENT]"], "blue");
assert.equal(TAG_COLORS["[ปริศนา]"], "orange");
assert.equal(TAG_COLORS["[สำคัญ]"], "brown");
assert.equal(TAG_COLORS["[Legacy ต่าง]"], "red");
assert.equal(TAG_COLORS["[Legacy]"], "red");
assert.equal(TAG_COLORS["[เสริม]"], "green");
assert.equal(TAG_COLORS["[Repo check]"], "purple");

const rt = taggedRichText("[EVENT]", "Sprout Tower ได้ HM05 Flash");
assert.equal(rt.length, 2);
assert.equal(rt[0].text.content, "[EVENT]");
assert.equal(rt[0].annotations.bold, true);
assert.equal(rt[0].annotations.color, "blue");
assert.equal(rt[1].text.content, " Sprout Tower ได้ HM05 Flash");
assert.equal(rt[1].annotations.color, "default");
assert.notEqual(rt[0].text.content + rt[1].text.content, rt[0].text.content);

const legacy = taggedRichText("[Legacy ต่าง]", "Falkner ใช้ Noctowl");
assert.equal(legacy[0].annotations.color, "red");

assert.deepEqual(OLD_IDS, {
  hub: "3b7da311-a58e-80c2-b287-de7ce0dc63fd",
  map: "3b8da311-a58e-819f-b27c-eb97dbaca47b",
  johto: "3b8da311-a58e-811f-92dd-cdb621adacd4",
});

for (const needle of ["Running Shoes", "Berry"]) {
  assert.ok(PART_REQUIRED.part1.some((s) => s.includes(needle)), needle);
}
assert.ok(PART_REQUIRED.part2.some((s) => s.includes("Mystery Egg")));
for (const needle of ["Noctowl", "HM05", "Togepi", "Mud-Slap"]) {
  assert.ok(PART_REQUIRED.part3.some((s) => s.includes(needle)), needle);
}
assert.ok(HUB_QOL_REQUIRED.some((s) => /Running Shoes/i.test(s)));
assert.ok(HUB_QOL_REQUIRED.some((s) => /Hard Mode/i.test(s)));

console.log("ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/notion_johto_outline.test.mjs`  
Expected: FAIL (`Cannot find module` or named export missing)

- [ ] **Step 3: Write minimal implementation**

Create `scripts/notion_johto_outline.mjs`:

```js
export const OLD_IDS = {
  hub: "3b7da311-a58e-80c2-b287-de7ce0dc63fd",
  map: "3b8da311-a58e-819f-b27c-eb97dbaca47b",
  johto: "3b8da311-a58e-811f-92dd-cdb621adacd4",
};

export const TAG_COLORS = {
  "[EVENT]": "blue",
  "[ปริศนา]": "orange",
  "[สำคัญ]": "brown",
  "[Legacy ต่าง]": "red",
  "[Legacy]": "red",
  "[เสริม]": "green",
  "[Repo check]": "purple",
};

export function taggedRichText(tag, body) {
  const color = TAG_COLORS[tag];
  if (!color) throw new Error(`unknown tag: ${tag}`);
  const rest = body.startsWith(" ") ? body : ` ${body}`;
  return [
    {
      type: "text",
      text: { content: tag },
      annotations: { bold: true, color },
    },
    {
      type: "text",
      text: { content: rest },
      annotations: { color: "default" },
    },
  ];
}

const PART = (n, title) => ({
  id: `part${n}`,
  title,
  source: `https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal/Part_${n}`,
});

export const JOHTO_TOGGLES = [
  PART(1, "New Bark (Part 1)"),
  PART(2, "Cherrygrove (Part 2)"),
  PART(3, "Violet (Part 3)"),
  PART(4, "Union Cave / Ruins (Part 4)"),
  PART(5, "Azalea (Part 5)"),
  PART(6, "Goldenrod (Part 6)"),
  PART(7, "National Park (Part 7)"),
  PART(8, "Ecruteak (Part 8)"),
  PART(9, "Olivine (Part 9)"),
  PART(10, "Cianwood (Part 10)"),
  PART(11, "Mahogany (Part 11)"),
  PART(12, "Radio Tower (Part 12)"),
  PART(13, "Blackthorn (Part 13)"),
  PART(14, "Victory Road (Part 14)"),
  PART(15, "Indigo Plateau (Part 15)"),
  {
    id: "postgame_johto",
    title: "หลังเกม Johto (GS Ball / Celebi / Tin Tower)",
    source: null,
  },
];

export const HUB_QOL_REQUIRED = [
  "Running Shoes (B)",
  "Hard Mode",
  "Ghost",
  "Dark",
];

export const PART_REQUIRED = {
  part1: [
    "[เสริม] Running Shoes กด B (ใช้ตอน Surf ได้ด้วย)",
    "[EVENT] รับ starter Lv.5 + Berry จาก Professor Elm",
  ],
  part2: [
    "[EVENT] พบบ้าน Mr. Pokémon ได้ Mystery Egg แล้วกลับ Elm's Lab — เจอ Rival (starter Lv.5 ตัวที่ผู้เล่นไม่ได้เลือก)",
  ],
  part3: [
    "[EVENT] Sprout Tower สู้ Sage Li ได้ HM05 Flash — ได้ก่อนหรือหลังยิมก็ได้; ใช้ Flash นอกแบทเทิลต้องมี Zephyr Badge",
    "[EVENT] Gym 1 Falkner (Flying) → Zephyr Badge + TM31 Mud-Slap",
    "[Legacy ต่าง] Falkner ใช้ Pidgey Lv.8 + Noctowl Lv.10 (Berry) — ไม่ใช่ Pidgeotto ของต้นฉบับ",
    "[EVENT] รับไข่ Togepi จาก Elm's Aide ที่ Violet Pokémon Center หลังชนะ Falkner",
  ],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/notion_johto_outline.test.mjs`  
Expected: stdout `ok`, exit 0

- [ ] **Step 5: graphify + optional commit**

Run: `graphify update .`  
Commit only if the user asked:

```bash
git add scripts/notion_johto_outline.mjs scripts/notion_johto_outline.test.mjs docs/superpowers/specs/2026-08-15-notion-walkthrough-rebuild-design.md
git commit -m "$(cat <<'EOF'
Add Johto Notion rebuild outline constants and tag helper.

EOF
)"
```

---

### Task 2: Archive the old hub tree

**Files:**
- Notion: new page titled `Archive`
- Modify (move, not edit body): page `3b7da311-a58e-80c2-b287-de7ce0dc63fd`

**Interfaces:**
- Consumes: `OLD_IDS.hub` from `scripts/notion_johto_outline.mjs`
- Produces: `archive` UUID in `docs/superpowers/artifacts/notion-rebuild-ids.json` (may be partial until Task 3)

- [ ] **Step 1: Authenticate and read parent**

`GetMcpTools` for Notion. If `needsAuth`, `mcp_auth`. Retrieve page `3b7da311-a58e-80c2-b287-de7ce0dc63fd`. Record `parent` (`page_id` or workspace). That parent is where **both** `Archive` and the new hub will live as siblings.

- [ ] **Step 2: Create Archive page**

Create a page titled exactly `Archive` with that parent. Empty body except one paragraph: `Hub เก่ารอบ 2026-08-11 — อย่าใช้เล่น; ใช้ hub ใหม่`

- [ ] **Step 3: Move old hub under Archive**

Move page `3b7da311-a58e-80c2-b287-de7ce0dc63fd` so its parent is the Archive page id. Children (`แผนที่`, `เดินเนื้อเรื่อง Johto`, …) stay nested under the old hub.

Do **not** delete blocks. Do **not** click Notion’s Archive on the old hub.

- [ ] **Step 4: Verify + write partial ids**

Retrieve Archive’s children. Must include `3b7da311-a58e-80c2-b287-de7ce0dc63fd`. Retrieve old hub: parent is Archive. Old Johto `3b8da311-a58e-811f-92dd-cdb621adacd4` still opens and still has content.

Write `docs/superpowers/artifacts/notion-rebuild-ids.json`:

```json
{
  "old": {
    "hub": "3b7da311-a58e-80c2-b287-de7ce0dc63fd",
    "map": "3b8da311-a58e-819f-b27c-eb97dbaca47b",
    "johto": "3b8da311-a58e-811f-92dd-cdb621adacd4"
  },
  "archive": "<ARCHIVE_PAGE_UUID>",
  "parent": "<PARENT_UUID_OR_null_if_workspace>"
}
```

Expected: Archive lists the old Pokemon page; old walkthrough still readable.

---

### Task 3: New hub + Johto + Kanto stub

**Files:**
- Notion: three new pages
- Modify: `docs/superpowers/artifacts/notion-rebuild-ids.json`
- Modify: `.cursor/rules/pokemon-crystal-legacy.mdc` (hub URL + page ID lines only)

**Interfaces:**
- Consumes: Archive sibling `parent` from Task 2; `HUB_QOL_REQUIRED`; `taggedRichText`
- Produces: `hub`, `pages.johto`, `pages.kanto` UUIDs in the ids JSON

- [ ] **Step 1: Create three pages as siblings of Archive**

| Title | Role |
|---|---|
| `Pokemon Crystal Legacy` | new hub |
| `เดินเนื้อเรื่อง Johto` | child of **new hub** |
| `เดินเนื้อเรื่อง Kanto` | child of **new hub** |

Create hub first under the same parent as Archive. Create Johto and Kanto with `parent.page_id` = new hub.

- [ ] **Step 2: Hub body**

Append to new hub, in order:

1. Paragraph: `ตอนเล่นเปิด toggle ตาม Part บนหน้า Johto — checklist อยู่บนสุดใน toggle แล้วตามด้วยเนื้อเรื่อง`
2. Bulleted page mentions: Johto, Kanto, Archive (Notion mention/link to those pages)
3. Bullets with URLs:
   - https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal
   - https://docs.google.com/document/d/1Zku4s049Sri266zr4BhF-riqecOOHjytfZPbQULmcYk/edit
   - https://pokemoncompletion.com/completion/Crystal
4. Callout title `เล่น / QoL ทั่วเกม` with bullets (tag split via `taggedRichText`):
   - `[เสริม] Running Shoes (B) — ใช้ตอน Surf ได้`
   - `[เสริม] Nurse Joy ฮีลเร็วขึ้น; ชื่อ TM เห็นในเกม; ลบ HM ได้ตอนเรียนท่าใหม่`
   - `[สำคัญ] Hard Mode: ห้ามใช้ไอเท็มในถุงระหว่างสู้ + บังคับ Set. Hardcore: เหมือนกัน + ชุบไม่ได้`
   - `[Legacy ต่าง] Ghost เป็น Special, Dark เป็น Physical`

- [ ] **Step 3: Kanto stub**

On `เดินเนื้อเรื่อง Kanto` one paragraph only: `โครงว่าง — เติมหลัง Johto Part 1–15`

- [ ] **Step 4: Johto legend (no toggles yet)**

On Johto, two paragraphs:

- `แท็ก: [EVENT] น้ำเงิน · [ปริศนา] ส้ม · [สำคัญ] น้ำตาล · [Legacy ต่าง] แดง · [เสริม] เขียว · [Repo check] ม่วง`
- Link: https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal

- [ ] **Step 5: Write ids + update cursor rule**

Merge into `docs/superpowers/artifacts/notion-rebuild-ids.json`:

```json
{
  "old": {
    "hub": "3b7da311-a58e-80c2-b287-de7ce0dc63fd",
    "map": "3b8da311-a58e-819f-b27c-eb97dbaca47b",
    "johto": "3b8da311-a58e-811f-92dd-cdb621adacd4"
  },
  "archive": "<from task 2>",
  "parent": "<from task 2>",
  "hub": "<NEW_HUB_UUID>",
  "pages": {
    "johto": "<JOHTO_UUID>",
    "kanto": "<KANTO_UUID>"
  },
  "toggles": {}
}
```

In `.cursor/rules/pokemon-crystal-legacy.mdc` replace only:

- URL line with `https://www.notion.so/<NEW_HUB_UUID_WITHOUT_DASHES>` or the share URL Notion returns
- `Page ID: \`<NEW_HUB_UUID>\``

Keep the Archive old id out of that rule. Leave tag-color table unchanged.

- [ ] **Step 6: Verify**

Retrieve new hub children: Johto + Kanto page mentions/child pages exist. Retrieve hub text: contains `Running Shoes` and `Hard Mode`. Old hub still under Archive.

Run:

```bash
node -e "
import fs from 'node:fs';
import assert from 'node:assert/strict';
const j = JSON.parse(fs.readFileSync('docs/superpowers/artifacts/notion-rebuild-ids.json','utf8'));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
assert.match(j.hub, uuid);
assert.match(j.pages.johto, uuid);
assert.match(j.pages.kanto, uuid);
assert.match(j.archive, uuid);
assert.notEqual(j.hub, j.old.hub);
console.log('ids ok');
"
```

Expected: `ids ok`

---

### Task 4: Sixteen empty Johto toggles

**Files:**
- Notion Johto page `pages.johto`
- Modify: `docs/superpowers/artifacts/notion-rebuild-ids.json` key `toggles`

**Interfaces:**
- Consumes: `JOHTO_TOGGLES` from `scripts/notion_johto_outline.mjs`; `pages.johto`
- Produces: `toggles.part1` … `toggles.part15` + `toggles.postgame_johto` block UUIDs

- [ ] **Step 1: Append 16 toggle blocks**

For each entry in `JOHTO_TOGGLES` order, append one toggle whose title rich_text is exactly `entry.title`.

Inside each toggle, one paragraph only:

- If `source` is a string: `แหล่ง: ` + that URL
- If `source` is `null`: `เติมหลังจบ Johto หลัก (Part 1–15)`

Do not add checklist or เนื้อเรื่อง yet. Leave toggles **collapsed** (Notion default).

If the API rejects toggle+children in one call, create empty toggles then append the paragraph to each toggle id.

- [ ] **Step 2: Save toggle block ids**

Retrieve Johto block children. Map each toggle heading to `JOHTO_TOGGLES[i].id`. Write `toggles` object on the ids JSON (16 keys).

- [ ] **Step 3: Verify titles**

Run (after saving ids):

```bash
node -e "
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { JOHTO_TOGGLES } from './scripts/notion_johto_outline.mjs';
const j = JSON.parse(fs.readFileSync('docs/superpowers/artifacts/notion-rebuild-ids.json','utf8'));
assert.equal(Object.keys(j.toggles).length, 16);
for (const t of JOHTO_TOGGLES) {
  assert.ok(j.toggles[t.id], 'missing ' + t.id);
}
console.log('toggles ok');
"
```

Expected: `toggles ok`. Spot-check Notion: 16 collapsed toggles; Part 1 title `New Bark (Part 1)`; last title starts with `หลังเกม Johto`.

---

### Task 5: Fill Part 1 (New Bark)

**Files:**
- Notion toggle `toggles.part1`
- Create: `docs/superpowers/artifacts/johto-part-01-dump.txt`

**Interfaces:**
- Consumes: `JOHTO_TOGGLES[0]`, `PART_REQUIRED.part1`, `taggedRichText`
- Produces: filled toggle; dump file containing every `PART_REQUIRED.part1` string

- [ ] **Step 1: Fetch Bulbapedia Part 1**

`ctx_fetch_and_index`  
URL: `https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal/Part_1`  
source: `bulbapedia-crystal-part-1`  

If fetch fails: stop. Do not write fake New Bark prose.

- [ ] **Step 2: Confirm starter Berry in repo**

`graphify query "Elm starter party Berry"` then read the gift/starter path (Elm’s Lab map / script). Confirm starter is Lv.5 and held Berry before writing the checklist. If repo disagrees with Doc, write repo + `[Repo check]`.

- [ ] **Step 3: Append Checklist + เนื้อเรื่อง inside `toggles.part1`**

Keep the existing `แหล่ง:` paragraph.

Heading `Checklist` then bullets from `PART_REQUIRED.part1` using `taggedRichText` (exact strings):

- `[เสริม] Running Shoes กด B (ใช้ตอน Surf ได้ด้วย)`
- `[EVENT] รับ starter Lv.5 + Berry จาก Professor Elm`

Add extra play bullets only if they come from Part 1 (Mom, set time, Route 29 to Cherrygrove, rival not yet). No wild tables.

Heading `เนื้อเรื่อง` then Thai translation of Part 1 covering: intro/options/time, New Bark layout (home, Elm’s Lab, Route 29 west), receiving the starter, leaving town. Keep names in English.

- [ ] **Step 4: Dump + assert**

Retrieve toggle `part1` children; write concatenated plain text to `docs/superpowers/artifacts/johto-part-01-dump.txt`.

```bash
node -e "
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PART_REQUIRED } from './scripts/notion_johto_outline.mjs';
const d = fs.readFileSync('docs/superpowers/artifacts/johto-part-01-dump.txt','utf8');
for (const s of PART_REQUIRED.part1) assert.ok(d.includes(s), s);
assert.ok(d.includes('New Bark') || d.includes('Elm'));
console.log('part1 dump ok');
"
```

Expected: `part1 dump ok`

---

### Task 6: Fill Part 2 (Cherrygrove)

**Files:**
- Notion toggle `toggles.part2`
- Create: `docs/superpowers/artifacts/johto-part-02-dump.txt`

**Interfaces:**
- Consumes: `JOHTO_TOGGLES[1]`, `PART_REQUIRED.part2`
- Produces: filled toggle; dump containing `PART_REQUIRED.part2` strings

- [ ] **Step 1: Fetch Bulbapedia Part 2**

`ctx_fetch_and_index`  
URL: `https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal/Part_2`  
source: `bulbapedia-crystal-part-2`

Stop on fetch failure.

- [ ] **Step 2: Confirm first rival in repo**

Read `data/trainers/parties.asm` `Rival1Group` entries 1–3: each is one Johto starter at **Lv.5** (`CHIKORITA` / `CYNDAQUIL` / `TOTODILE`). Part 2 checklist must **not** claim Larvitar (that is a later rival fight).

- [ ] **Step 3: Append Checklist + เนื้อเรื่อง inside `toggles.part2`**

Keep `แหล่ง:`. Heading `Checklist` with exact `PART_REQUIRED.part2` bullet via `taggedRichText`:

- `[EVENT] พบบ้าน Mr. Pokémon ได้ Mystery Egg แล้วกลับ Elm's Lab — เจอ Rival (starter Lv.5 ตัวที่ผู้เล่นไม่ได้เลือก)`

Add Part 2-only bullets as needed (Route 30, Cherrygrove, map from guide, deliver egg, Elm gives Pokédex / Balls per the **translated Part** after verifying `maps/ElmsLab.asm` if the reward list might be Legacy-changed — if unsure, `[?]`).

Heading `เนื้อเรื่อง`: Thai translation of Part 2 (Cherrygrove, Route 30, Mr. Pokémon, return to lab, rival, Elm). No wild tables.

- [ ] **Step 4: Dump + assert**

Write `docs/superpowers/artifacts/johto-part-02-dump.txt`.

```bash
node -e "
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PART_REQUIRED } from './scripts/notion_johto_outline.mjs';
const d = fs.readFileSync('docs/superpowers/artifacts/johto-part-02-dump.txt','utf8');
for (const s of PART_REQUIRED.part2) assert.ok(d.includes(s), s);
assert.ok(!/Larvitar/i.test(d), 'do not put later rival team on Part 2');
console.log('part2 dump ok');
"
```

Expected: `part2 dump ok`

---

### Task 7: Fill Part 3 (Violet)

**Files:**
- Notion toggle `toggles.part3`
- Create: `docs/superpowers/artifacts/johto-part-03-dump.txt`

**Interfaces:**
- Consumes: `JOHTO_TOGGLES[2]`, `PART_REQUIRED.part3`
- Produces: filled toggle; dump containing all `PART_REQUIRED.part3` strings

- [ ] **Step 1: Fetch Bulbapedia Part 3**

`ctx_fetch_and_index`  
URL: `https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal/Part_3`  
source: `bulbapedia-crystal-part-3`

Stop on fetch failure.

- [ ] **Step 2: Confirm Legacy gym + Flash + Togepi in repo**

`graphify query "Falkner gym party Flash Togepi"` then read:

- `data/trainers/parties.asm` `FalknerGroup` first team: `db 8, PIDGEY` … `db 10, NOCTOWL, BERRY`
- Sprout Tower map/script for HM05 Flash (`maps/SproutTower3F.asm` or equivalent)
- `maps/VioletPokecenter1F.asm` for Togepi egg after Falkner

Do not write Pidgeotto as Falkner’s ace.

- [ ] **Step 3: Append Checklist + เนื้อเรื่อง inside `toggles.part3`**

Keep `แหล่ง:`. Heading `Checklist` with **all four** `PART_REQUIRED.part3` strings via `taggedRichText`, in this order:

- `[EVENT] Sprout Tower สู้ Sage Li ได้ HM05 Flash — ได้ก่อนหรือหลังยิมก็ได้; ใช้ Flash นอกแบทเทิลต้องมี Zephyr Badge`
- `[EVENT] Gym 1 Falkner (Flying) → Zephyr Badge + TM31 Mud-Slap`
- `[Legacy ต่าง] Falkner ใช้ Pidgey Lv.8 + Noctowl Lv.10 (Berry) — ไม่ใช่ Pidgeotto ของต้นฉบับ`
- `[EVENT] รับไข่ Togepi จาก Elm's Aide ที่ Violet Pokémon Center หลังชนะ Falkner`

Optional extra: Route 31, Dark Cave mention as optional (Flash) without pasting Dark Cave item tables (maps page is archived).

Heading `เนื้อเรื่อง`: Thai translation of Part 3 (Route 31, Violet, Sprout Tower lore/sages, gym challenge). When describing Falkner’s team, use the Legacy pair above, not Bulbapedia’s vanilla party. No wild tables.

- [ ] **Step 4: Dump + assert**

Write `docs/superpowers/artifacts/johto-part-03-dump.txt`.

```bash
node -e "
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PART_REQUIRED } from './scripts/notion_johto_outline.mjs';
const d = fs.readFileSync('docs/superpowers/artifacts/johto-part-03-dump.txt','utf8');
for (const s of PART_REQUIRED.part3) assert.ok(d.includes(s), s);
assert.ok(/Noctowl/.test(d));
assert.ok(!/Pidgeotto/.test(d), 'vanilla Falkner ace must not appear as current team');
console.log('part3 dump ok');
"
```

Expected: `part3 dump ok`

---

### Task 8: Milestone A+B QA

**Files:** none new (read Notion + artifacts)

**Interfaces:**
- Consumes: ids JSON, dumps from Tasks 5–7, spec milestones A and B
- Produces: this checklist all checked, or a written gap list in the session (do not silently skip)

- [ ] **Step 1: IA checklist (Milestone A)**

- [ ] `Archive` is a sibling of the new hub, not inside it
- [ ] Old hub `3b7da311-a58e-80c2-b287-de7ce0dc63fd` is a child of Archive and still has its old children
- [ ] New hub id ≠ old hub id
- [ ] New hub has Johto, Kanto, Archive links + three external URLs + QoL callout
- [ ] Kanto page is still the stub sentence only
- [ ] Johto has exactly 16 toggles with titles matching `JOHTO_TOGGLES`
- [ ] `.cursor/rules/pokemon-crystal-legacy.mdc` page ID is the **new** hub

- [ ] **Step 2: Early-play checklist (Milestone B)**

- [ ] Part 1–3 toggles each contain Checklist then เนื้อเรื่อง
- [ ] `johto-part-01-dump.txt` / `02` / `03` still pass the dump node asserts from Tasks 5–7
- [ ] Parts 4–15 toggles still empty aside from `แหล่ง:` (or stub line)
- [ ] Post-game Johto toggle still stub
- [ ] No wild-encounter % table pasted from Bulbapedia in Parts 1–3

- [ ] **Step 3: Re-run outline unit test**

Run: `node scripts/notion_johto_outline.test.mjs`  
Expected: `ok`

- [ ] **Step 4: graphify**

Run: `graphify update .` after any remaining local file edits.

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| Archive entire old hub as sibling, move not delete | 2 |
| New thin hub + Johto + Kanto stub | 3 |
| Hub QoL callout (Running Shoes, Hard Mode, Ghost/Dark) | 3 |
| Cursor rule points at new hub | 3 |
| 16 Part toggles, collapsed, source link inside | 4 |
| Toggle = Bulbapedia Part, not city-only | 1, 4 |
| Checklist above prose inside toggle | 5–7 |
| Thai narrative + English names | 5–7 |
| No vanilla wild/trainer tables | 5–7, 8 |
| Legacy Falkner / Flash / Togepi from repo | 7 |
| Tag color split spans | 1 (`taggedRichText`), 5–7 |
| Milestone A + B only; C/D out of scope | 4 empty later parts; 8 |
| Doc ≠ repo → repo | 5–7 confirm steps |
| Fetch fail → stop | 5–7 Step 1 |

## Out of this plan (follow-up)

- Johto Parts 4–15 body
- Post-game Johto (GS Ball / Celebi / Tin Tower)
- Kanto walkthrough
- Rebuilding maps / type chart / mart pages on the new hub
