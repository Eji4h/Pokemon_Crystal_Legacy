import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const asmPath = path.join(root, "data/types/type_matchups.asm");
const outPath = path.join(root, "docs/superpowers/artifacts/gen2-type-chart-notion.md");

const MULT = {
  SUPER_EFFECTIVE: 2,
  NOT_VERY_EFFECTIVE: 0.5,
  NO_EFFECT: 0,
};

const TYPES = [
  "NORMAL", "FIGHTING", "FLYING", "POISON", "GROUND", "ROCK", "BUG",
  "GHOST", "STEEL", "FIRE", "WATER", "GRASS", "ELECTRIC", "PSYCHIC_TYPE",
  "ICE", "DRAGON", "DARK",
];

function label(t) {
  if (t === "PSYCHIC_TYPE") return "Psychic";
  return t[0] + t.slice(1).toLowerCase();
}

function parseMatchups(asm) {
  const main = [];
  let inForesight = false;
  for (const line of asm.split("\n")) {
    if (/db\s+-2/.test(line)) {
      inForesight = true;
      continue;
    }
    if (/db\s+-1/.test(line)) break;
    const m = line.match(/db\s+(\w+),\s+(\w+),\s+(\w+)/);
    if (!m || !(m[3] in MULT)) continue;
    main.push({
      atk: m[1],
      def: m[2],
      mult: MULT[m[3]],
      foresightRemovable: inForesight,
    });
  }
  return main;
}

function bucket(rows, type, mode) {
  const hit = { 2: [], 0.5: [], 0: [] };
  for (const r of rows) {
    if (mode === "atk" && r.atk === type) hit[r.mult].push(label(r.def));
    if (mode === "def" && r.def === type) hit[r.mult].push(label(r.atk));
  }
  for (const k of Object.keys(hit)) hit[k] = [...new Set(hit[k])].sort();
  return hit;
}

function listLine(title, arr) {
  return `- ${title}: ${arr.length ? arr.join(", ") : "—"}`;
}

function toggleBlock(type, rows) {
  const name = label(type);
  const atk = bucket(rows, type, "atk");
  const def = bucket(rows, type, "def");
  return [
    `## Toggle: ${name}`,
    "",
    `### โจมตีด้วย ${name}`,
    listLine("×2", atk[2]),
    listLine("×0.5", atk[0.5]),
    listLine("×0", atk[0]),
    "",
    `### โดน ${name} เข้า`,
    listLine("×2 จาก", def[2]),
    listLine("×0.5 จาก", def[0.5]),
    listLine("×0 จาก", def[0]),
    "",
  ].join("\n");
}

function mermaidBlocks() {
  return [
    "## Mermaid: Classic",
    "",
    "```mermaid",
    "flowchart LR",
    "  Fire -->|x2| Grass",
    "  Grass -->|x2| Water",
    "  Water -->|x2| Fire",
    "  Electric -->|x2| Water",
    "  Water -.->|x0.5| Grass",
    "  Electric -.->|x0| Ground",
    "```",
    "",
    "_Notes: Fire also x2 vs Ice/Bug/Steel; Grass x2 vs Ground/Rock; Electric x2 vs Flying._",
    "",
    "## Mermaid: Rock-Ground-Fighting",
    "",
    "```mermaid",
    "flowchart LR",
    "  Fighting -->|x2| Rock",
    "  Fighting -->|x2| Steel",
    "  Ground -->|x2| Rock",
    "  Ground -->|x2| Steel",
    "  Ground -->|x2| Fire",
    "  Rock -->|x2| Fire",
    "  Rock -->|x2| Flying",
    "  Rock -->|x2| Bug",
    "  Flying -->|x2| Fighting",
    "  Flying -->|x2| Bug",
    "  Bug -->|x2| Grass",
    "  Steel -->|x2| Rock",
    "```",
    "",
    "_Notes: Ground x0 vs Flying; Fighting x0 vs Ghost (Foresight removes); Flying x0.5 vs Rock/Steel._",
    "",
    "## Mermaid: Psychic-axis",
    "",
    "```mermaid",
    "flowchart LR",
    "  Psychic -->|x2| Fighting",
    "  Psychic -->|x2| Poison",
    "  Dark -->|x2| Psychic",
    "  Dark -->|x2| Ghost",
    "  Ghost -->|x2| Psychic",
    "  Ghost -->|x2| Ghost",
    "  Bug -->|x2| Psychic",
    "  Bug -->|x2| Dark",
    "  Psychic -->|x0| Dark",
    "```",
    "",
    "## Mermaid: Ice-Dragon",
    "",
    "```mermaid",
    "flowchart LR",
    "  Ice -->|x2| Dragon",
    "  Ice -->|x2| Grass",
    "  Ice -->|x2| Ground",
    "  Ice -->|x2| Flying",
    "  Dragon -->|x2| Dragon",
    "  Steel -->|x2| Ice",
    "  Steel -->|x2| Rock",
    "  Dragon -.->|x0.5| Steel",
    "```",
    "",
    "## Mermaid: Misc",
    "",
    "```mermaid",
    "flowchart LR",
    "  Normal -->|x0.5| Rock",
    "  Normal -->|x0.5| Steel",
    "  Normal -->|x0| Ghost",
    "  Poison -->|x2| Grass",
    "  Poison -->|x0| Steel",
    "  Fighting -->|x2| Normal",
    "```",
    "",
    "_Foresight / Odor Sleuth: ignores Ghost immunities to Normal and Fighting._",
    "",
  ].join("\n");
}

const rows = parseMatchups(fs.readFileSync(asmPath, "utf8"));
const parts = [
  "# Gen 2 type chart — Notion paste source",
  "",
  "Generated from `data/types/type_matchups.asm`. Do not edit by hand; re-run script.",
  "",
  "Callout: Gen 2 has 17 types (no Fairy). Foresight removes Ghost immunities to Normal/Fighting.",
  "",
  mermaidBlocks(),
];
for (const t of TYPES) parts.push(toggleBlock(t, rows));

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, parts.join("\n"));
console.log(`wrote ${outPath}`);
