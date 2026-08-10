# Notion Hub Reorg + Gen 2 Type Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thin the Notion Pokemon hub, move maps + Johto walkthrough into child pages (Badge 1–8 + League), and replace the type chart with Mermaid group diagrams plus 17 dual-perspective toggles sourced from `data/types/type_matchups.asm`.

**Architecture:** Generate type-chart Notion-ready markdown from the ROM matchup table in-repo (verifiable), then apply Notion structure via MCP `user-Notion Ej!4h (API token)`: create child pages, migrate blocks, rebuild hub nav and อ้างอิงด่วน. Walkthrough prose is moved, not rewritten.

**Tech Stack:** Notion API (MCP), Node.js script (no new deps), source `data/types/type_matchups.asm`, design spec `docs/superpowers/specs/2026-08-11-notion-hub-reorg-design.md`

## Global Constraints

- Hub page id: `3b7da311-a58e-80c2-b287-de7ce0dc63fd`
- Multipliers MUST match `data/types/type_matchups.asm` (include Ghost immunities from the Foresight section as default ×0; footnote that Foresight removes them)
- No Fairy; 17 Gen 2 types only
- Mermaid = Notion code block with language Mermaid (native preview)
- Do not split Kanto into Badge children this round
- Do not rewrite walkthrough bullets; migrate existing blocks / equivalent rich text
- Preserve tags: `[EVENT]`, `[ปริศนา]`, `[เสริม]`, `[สำคัญ]`, `[Legacy ต่าง]`
- Label legend callout stays on hub only
- Full 17×17 table kept as collapsed backup
- Do not commit unless user asks mid-execution (plan commits below are optional checkpoints for the implementing agent when user has enabled commits for this workstream)
- After any local code/script changes: `graphify update .`
- graphify rule for exploration: run `graphify query` before broad Grep when touching ROM data

## File map

| Path | Role |
|---|---|
| `docs/superpowers/specs/2026-08-11-notion-hub-reorg-design.md` | Approved design (read-only during impl) |
| `scripts/gen2_type_chart_notion.mjs` | Parse matchups → Notion-ready md + mermaid |
| `scripts/gen2_type_chart_notion.test.mjs` | Asserts on generated chart |
| `docs/superpowers/artifacts/gen2-type-chart-notion.md` | Generated paste source for Notion |
| Notion hub + 10 child pages | Runtime deliverable |

---

### Task 1: Type-chart generator + tests

**Files:**
- Create: `scripts/gen2_type_chart_notion.mjs`
- Create: `scripts/gen2_type_chart_notion.test.mjs`
- Create: `docs/superpowers/artifacts/gen2-type-chart-notion.md` (via script)

**Interfaces:**
- Consumes: `data/types/type_matchups.asm`
- Produces: `docs/superpowers/artifacts/gen2-type-chart-notion.md` with sections `## Mermaid: <group>`, `## Toggle: <Type>`, attack/defend lists; CLI exit 0

- [ ] **Step 1: Write the failing test**

Create `scripts/gen2_type_chart_notion.test.mjs`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/gen2_type_chart_notion.test.mjs`  
Expected: FAIL (script missing or artifact missing)

- [ ] **Step 3: Write minimal implementation**

Create `scripts/gen2_type_chart_notion.mjs`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/gen2_type_chart_notion.test.mjs`  
Expected: prints `ok` and exit 0

- [ ] **Step 5: Commit (if user requested commits for this workstream)**

```bash
git add scripts/gen2_type_chart_notion.mjs scripts/gen2_type_chart_notion.test.mjs docs/superpowers/artifacts/gen2-type-chart-notion.md
git commit -m "$(cat <<'EOF'
Add Gen 2 type-chart generator for Notion paste source.

EOF
)"
graphify update .
```

---

### Task 2: Create Notion child page shells

**Files:**
- Notion only (MCP). No repo files.

**Interfaces:**
- Consumes: hub id `3b7da311-a58e-80c2-b287-de7ce0dc63fd`
- Produces: 10 child page ids (store in chat / optional `docs/superpowers/artifacts/notion-child-ids.json`)

- [ ] **Step 1: List MCP tools**

Call `GetMcpTools` for `user-Notion Ej!4h (API token)` focusing on `API-post-page`, `API-patch-block-children`, `API-get-block-children`, `API-update-a-block`, `API-delete-a-block`, `API-move-page`.

- [ ] **Step 2: Create children under hub**

Create pages with titles exactly:

1. `แผนที่`
2. `Johto — Badge 1 — Falkner / Violet`
3. `Johto — Badge 2 — Bugsy / Azalea`
4. `Johto — Badge 3 — Whitney / Goldenrod`
5. `Johto — Badge 4 — Morty / Ecruteak`
6. `Johto — Badge 5 — Chuck / Cianwood`
7. `Johto — Badge 6 — Jasmine / Olivine`
8. `Johto — Badge 7 — Pryce / Mahogany`
9. `Johto — Badge 8 — Clair / Blackthorn`
10. `Johto — Pokémon League`

Parent: hub page id above. Each page starts with one paragraph placeholder: `ย้ายเนื้อหาจาก hub — ยังว่าง`.

- [ ] **Step 3: Verify**

`API-get-block-children` on hub — confirm 10 `child_page` (or linked pages) visible.  
Expected: all 10 titles present.

- [ ] **Step 4: Save ids**

Write `docs/superpowers/artifacts/notion-child-ids.json`:

```json
{
  "hub": "3b7da311-a58e-80c2-b287-de7ce0dc63fd",
  "pages": {
    "map": "<id>",
    "badge1": "<id>",
    "badge2": "<id>",
    "badge3": "<id>",
    "badge4": "<id>",
    "badge5": "<id>",
    "badge6": "<id>",
    "badge7": "<id>",
    "badge8": "<id>",
    "league": "<id>"
  }
}
```

---

### Task 3: Move แผนที่ off hub

**Files:**
- Notion hub + child `แผนที่`
- Reference heading ids from prior exploration: H1 `แผนที่` block `b4a62d77-4a42-4256-aff2-647a51e536ce`

**Interfaces:**
- Consumes: map child id from Task 2
- Produces: map images + Johto/Kanto blurbs only on child; hub has link only

- [ ] **Step 1: Inventory map blocks**

From hub, collect every block from H1 `แผนที่` until (not including) H1 `บริการและกิจกรรมประจำ` (`420b719d-e015-4a57-aa66-46e7fa806bc1`). Include Johto/Kanto images, route-order paragraph, quotes.

- [ ] **Step 2: Migrate**

Preferred: Notion UI **Move to** `แผนที่` page (preserves images).  
If API-only: recreate image blocks only if MCP supports external file URLs already on the page; otherwise stop and ask user to Move images manually, then continue with text via API.

- [ ] **Step 3: Hub stub**

Replace former map section with:

- Heading `แผนที่`
- Paragraph with mention link to child `แผนที่`
- One line: `ภาพ Johto / Kanto + ลำดับเส้นทางอยู่หน้าลูก`

- [ ] **Step 4: Verify**

Open child — both region images render. Hub — no large map images.  
Expected: images only on child.

---

### Task 4: Migrate walkthrough Badge 1–4

**Files:** Notion children badge1–badge4

**Interfaces:**
- Consumes: child ids; hub H2 clusters listed in design spec § Badge segment map
- Produces: content on children; removed from hub

| Child | Hub H2 sources (move inclusive until next H2/H1 boundary) |
|---|---|
| Badge 1 | `New Bark Town / Route 29 / Cherrygrove City`, `Route 30-31 / Violet City` |
| Badge 2 | `Union Cave / Azalea Town` |
| Badge 3 | `Ilex Forest / Goldenrod City` |
| Badge 4 | `Route 36 — Sudowoodo และ Squirtbottle`, `National Park / Route 37 / Ecruteak City`, `เส้นเรื่อง Suicune และ Eusine` (if Suicune beat fits later, leave cross-link note instead of forcing) |

- [ ] **Step 1: For each badge 1–4, prepend template header on child**

```
Goal: <Gym> → <Badge>
Prereq: <fill from existing callouts if any, else "—">
```

Use callout block via MCP.

- [ ] **Step 2: Move blocks**

Move listed H2 sections into the matching child (UI Move preferred). Keep tags intact.

- [ ] **Step 3: Footer Prev/Next**

Badge 1: Next → Badge 2  
Badge 2: Prev Badge 1 · Next Badge 3  
Badge 3: Prev Badge 2 · Next Badge 4  
Badge 4: Prev Badge 3 · Next Badge 5  
Plus link back to hub.

- [ ] **Step 4: Verify**

Hub search / TOC: those H2 titles gone from hub body. Children contain `[EVENT]` bullets.  
Expected: no orphan empty headings on hub for these segments.

---

### Task 5: Migrate walkthrough Badge 5–8 + League

**Files:** Notion children badge5–badge8 + league

| Child | Hub H2 sources |
|---|---|
| Badge 5 | `Route 38-39 / Olivine City`, `Battle Tower (Route 40)`, `Route 40-41 → Cianwood City` |
| Badge 6 | `กลับ Olivine / Route 42 / Mt. Mortar` |
| Badge 7 | `Route 43 / Lake of Rage / Mahogany Town` |
| Badge 8 | `Goldenrod รอบ 2 — Radio Tower Takeover`, `Route 44 → Ice Path`, `Blackthorn City` |
| League | `Route 34 — Day Care` (or link-only if better under Badge 3 — pick one home, link the other), `Pokémon League` |

- [ ] **Step 1: Move Badge 5–8 + League blocks** same method as Task 4

- [ ] **Step 2: Cross-link Olivine**

On Badge 5 add note: `รอบกลับ Olivine / Jasmine → ดู Badge 6`  
On Badge 6 add note: `เส้นทางมาถึงจาก Badge 5 (Cianwood)`  

- [ ] **Step 3: Remove empty H1 `เดินเนื้อเรื่อง Johto` body**

Replace hub section with heading + numbered/bulleted list of mention links to Badge 1–8 + League (one-line blurb each, e.g. `Badge 1 — Falkner · Flying · HM05 Flash`).

- [ ] **Step 4: Verify end-to-end Johto path**

Click hub → Badge 1 → … → League via Next links.  
Expected: chain works; Ice Path guide lives under Badge 8.

---

### Task 6: Rebuild อ้างอิงด่วน type chart on hub

**Files:**
- Notion hub section `ตารางอ้างอิงด่วน`
- Paste from: `docs/superpowers/artifacts/gen2-type-chart-notion.md`
- Existing blocks: H2 `ตารางชนะทาง / แพ้ทาง (Gen 2)` id `64addd2d-79e1-42a4-8999-4bcdd235f6e3`, table `4498a510-d356-41aa-85bb-e22b5ceaa7c9`

**Interfaces:**
- Consumes: artifact from Task 1
- Produces: Mermaid code blocks + 17 toggles above backup table

- [ ] **Step 1: Verify Physical/Special note for Legacy**

Read `constants/type_constants.asm` Ghost/Dark comments and battle code paths that force Ghost special / Dark physical. Update Notion callout:
- If Legacy matches vanilla Gen 2 narrative already on page: keep
- If Legacy differs: rewrite callout and tag `[Legacy ต่าง]` with one sentence what differs

- [ ] **Step 2: Insert Mermaid groups**

Under H2 type chart (above or replacing dense intro), for each `## Mermaid: …` in artifact:
1. Add heading_3 with group name
2. Add code block; set language to Mermaid; body = fenced content without outer fences
3. Add italic/paragraph notes under each

- [ ] **Step 3: Insert 17 toggles**

For each `## Toggle: Type` in artifact order:
- Create toggle block titled with type name
- Children: two headings or bold lines + bulleted ×2 / ×0.5 / ×0 lists from artifact

- [ ] **Step 4: Collapse backup table**

Wrap existing 17×17 (or current) matchup table in a toggle titled `ตารางเต็ม (สำรอง)`. Do not delete.

- [ ] **Step 5: Keep Gen 2 diff + P/S sections**

Ensure H3 `จุดที่ Gen 2 ต่างจากเกมรุ่นใหม่` and Physical/Special blocks remain after toggles.

- [ ] **Step 6: Spot-check vs asm**

Compare Water + Steel + Ghost toggles on Notion to artifact (already tested).  
Expected: Water ×2 Fire/Ground/Rock; Steel ×0 from Poison; Ghost ×0 from Normal/Fighting.

---

### Task 7: Hub quick links + TOC polish + final QA

**Files:** Notion hub top section only

- [ ] **Step 1: Add Quick links block after TOC**

Callout or bulleted list:
- แผนที่
- Johto Badge 1–8 + League (same links as walkthrough section — OK to duplicate short list)
- อ้างอิงด่วน / type chart (text “เลื่อนไปหัวข้อ ตารางอ้างอิงด่วน”)

- [ ] **Step 2: Confirm services + post-game still on hub**

H1 `บริการและกิจกรรมประจำ` and H1 `Post-game` still present with content. Kanto not split into badge children.

- [ ] **Step 3: Final success checklist**

- [ ] Hub has no large region maps
- [ ] Hub has no long Johto H2 town walkthrough body
- [ ] 10 children populated (map + 9 story)
- [ ] Mermaid previews render in Notion
- [ ] 17 toggles dual perspective
- [ ] Backup table collapsed
- [ ] Labels still on migrated events
- [ ] Prev/Next chain Badge 1→League works

- [ ] **Step 4: Optional commit of artifacts/ids**

```bash
git add docs/superpowers/artifacts/notion-child-ids.json docs/superpowers/specs/2026-08-11-notion-hub-reorg-design.md docs/superpowers/plans/2026-08-11-notion-hub-reorg.md
git commit -m "$(cat <<'EOF'
Document Notion hub reorg design, plan, and child page ids.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| Thin hub + children for map + Johto badges/league | 2–5, 7 |
| Maps on child only | 3 |
| Badge 1–8 + League split | 4–5 |
| Type toggles attack+defend | 1, 6 |
| Mermaid by groups via code block | 1, 6 |
| Source `type_matchups.asm` | 1, 6 |
| Keep 17×17 backup | 6 |
| Labels preserved / legend on hub | 4–5, 7 |
| No Kanto badge children | 7 checklist |
| Legacy P/S verify | 6 Step 1 |
| Foresight Ghost note | 1, 6 |

No TBD placeholders. Generator script is fully specified. Notion move steps allow UI fallback for images (explicit, not vague).
