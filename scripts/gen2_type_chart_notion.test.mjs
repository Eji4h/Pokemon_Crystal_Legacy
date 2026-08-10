import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "docs/superpowers/artifacts/gen2-type-chart-notion.md");
const script = path.join(root, "scripts/gen2_type_chart_notion.mjs");

const run = spawnSync(process.execPath, [script], { encoding: "utf8", cwd: root });
assert.equal(run.status, 0, run.stderr || run.stdout);
assert.ok(fs.existsSync(out), "artifact missing");
const md = fs.readFileSync(out, "utf8");

const types = [
  "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug",
  "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic",
  "Ice", "Dragon", "Dark",
];
for (const t of types) {
  assert.match(md, new RegExp(`## Toggle: ${t}\\b`), `missing toggle ${t}`);
}
assert.match(md, /## Mermaid: Classic/);
assert.match(md, /## Mermaid: Rock-Ground-Fighting/);
assert.match(md, /## Mermaid: Psychic-axis/);
assert.match(md, /## Mermaid: Ice-Dragon/);
assert.match(md, /## Mermaid: Misc/);

// Water attacks Fire/Ground/Rock for ×2 (from type_matchups.asm)
const water = md.split("## Toggle: Water")[1].split("## Toggle:")[0];
assert.match(water, /โจมตีด้วย Water/);
assert.match(water, /×2:[^\n]*Fire/);
assert.match(water, /×2:[^\n]*Ground/);
assert.match(water, /×2:[^\n]*Rock/);
assert.match(water, /โดน Water เข้า/);
assert.match(water, /×2 จาก:[^\n]*Electric/);
assert.match(water, /×2 จาก:[^\n]*Grass/);

// Ghost is immune to Normal & Fighting by default (Foresight section rows)
const ghost = md.split("## Toggle: Ghost")[1].split("## Toggle:")[0];
assert.match(ghost, /×0 จาก:[^\n]*Normal/);
assert.match(ghost, /×0 จาก:[^\n]*Fighting/);
assert.match(md, /Foresight/);

// Poison does not affect Steel
const steel = md.split("## Toggle: Steel")[1].split("## Toggle:")[0];
assert.match(steel, /×0 จาก:[^\n]*Poison/);

console.log("ok");
