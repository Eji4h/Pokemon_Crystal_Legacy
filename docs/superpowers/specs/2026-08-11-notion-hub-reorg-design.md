# Notion Hub Reorg + Gen 2 Type Chart — Design

**Date:** 2026-08-11  
**Status:** Approved (brainstorming)  
**Notion hub:** [Pokemon](https://app.notion.com/p/eji4h/Pokemon-3b7da311a58e80c2b287de7ce0dc63fd) (`3b7da311-a58e-80c2-b287-de7ce0dc63fd`)  
**MCP:** `user-Notion Ej!4h (API token)`

## Problem

Hub page is a single long walkthrough (~400+ blocks): maps, daily services, full Johto story, post-game, and reference tables mixed together. Hard to jump while playing. Gen 2 type chart exists as a wide table under อ้างอิงด่วน but is awkward mid-battle; user wants fast lookup plus small Mermaid diagrams.

## Goals

1. Reorganize the whole hub for findability while playing.
2. Easy Gen 2 type chart: per-type toggles (attack + defend) plus Mermaid diagrams by type group.
3. Preserve existing content and label system; migrate, do not rewrite walkthrough prose.

## Non-goals

- ROM / asm balance changes
- Full rewrite of walkthrough text
- Splitting daily services into their own child pages
- Kanto gym-by-gym child pages (this round)
- Interactive type calculator
- Impeccable `PRODUCT.md` / app UI work

## Decisions (locked)

| Topic | Choice |
|---|---|
| Scope | Full hub reorg + new type chart |
| Structure | Thin hub + child pages for maps and Johto walkthrough |
| Walkthrough split | One child per Johto Badge 1–8 + Pokémon League |
| Maps | Own child page (not on hub) |
| Type chart UX | Mermaid by groups + 17 type toggles |
| Toggle perspective | Both: attacking with type + defending as type |
| Mermaid delivery | Notion **code block** → language **Mermaid** (native preview) |
| Full 17×17 table | Keep as collapsed backup under toggles |
| Kanto | Stay short on hub Post-game; no Badge children this round |

## Architecture

### Hub (`Pokemon`) — top to bottom

1. Title + label legend callout (hub only)
2. Table of contents
3. **Quick links** (no large map images, no long walkthrough):
   - Child: แผนที่
   - Children: Johto Badge 1–8 + Pokémon League (one-line blurb each)
   - Anchor-style note to jump to อ้างอิงด่วน / type chart on same page
4. บริการและกิจกรรมประจำ (stays on hub)
5. Post-game short (GS Ball / beasts / Kanto overview)
6. **ตารางอ้างอิงด่วน** — type chart section first, then rock puzzles / hard-to-find NPCs; Gen 2 Physical/Special-by-type notes retained

### Child pages

| Page | Contents |
|---|---|
| แผนที่ | Existing Johto + Kanto map images and route-order blurbs moved as-is |
| Johto — Badge 1 … Badge 8 | Walkthrough blocks for that badge segment |
| Johto — Pokémon League | Victory Road / E4 / Rival |

### Badge segment map (cut by gym unlock, not raw map files)

| Child | Moves from current H2 clusters |
|---|---|
| Badge 1 — Falkner / Violet | New Bark → Cherrygrove → Route 30–31 → Violet (+ Sprout / Alph tied here) |
| Badge 2 — Bugsy / Azalea | Union Cave → Azalea → Slowpoke Well |
| Badge 3 — Whitney / Goldenrod | Ilex → Goldenrod (+ Farfetch'd / Cut) |
| Badge 4 — Morty / Ecruteak | Route 36 Sudowoodo → National Park → Ecruteak (+ Bug Contest if in that cluster) |
| Badge 5 — Chuck / Cianwood | Route 38–41 → first Olivine pass → Cianwood (+ Battle Tower if on path) |
| Badge 6 — Jasmine / Olivine | Return Olivine → Route 42 / Mt. Mortar through Mineral Badge |
| Badge 7 — Pryce / Mahogany | Route 43 → Lake of Rage → Mahogany → Rocket HQ |
| Badge 8 — Clair / Blackthorn | Goldenrod Radio Tower → Route 44 / Ice Path → Blackthorn |
| Pokémon League | Day Care / Route 26–27 / Victory Road / League (adjust if Day Care sits better with Badge 3 — prefer link across pages over duplication) |

Overlapping routes (Olivine twice, Radio Tower): put primary detail on one child; other child gets a short cross-link note.

### Child page template

1. Goal: gym / badge
2. Callout: prerequisites (HM, item, time-of-day)
3. Existing tagged bullets/callouts moved intact: `[EVENT]`, `[ปริศนา]`, `[เสริม]`, `[สำคัญ]`, `[Legacy ต่าง]`
4. Footer: Prev / Next badge + link back to hub

## Type chart design

**Source of truth for multipliers:** `data/types/type_matchups.asm` (this repo / Legacy). Do not copy modern Fairy-era charts.

**Physical / Special-by-type:** Existing Notion notes describe vanilla Gen 2 (Dark Special, Ghost Physical). This fork’s `constants/type_constants.asm` comments indicate Ghost/Dark category handling may differ for trade compatibility — verify against battle engine before finalizing that callout; label `[Legacy ต่าง]` if Legacy ≠ vanilla.

### Section order on hub

1. Callout: 17 types, no Fairy; Gen 2 only
2. Mermaid code blocks by group (4–5 diagrams)
3. Toggle per type (17)
4. Existing “Gen 2 differs from modern” notes
5. Physical / Special-by-type table/callout (verified)
6. Collapsed backup: full 17×17 table (existing)

### Mermaid groups

Use Notion code block, language Mermaid. Arrows = super-effective within the group; immunities / NVE as short notes under the diagram when edges would clutter.

| Group | Types |
|---|---|
| Classic | Fire · Water · Grass · Electric (Electric↔Water) |
| Rock / Ground / Fighting | Rock · Ground · Fighting · Flying · Bug · Steel |
| Psychic axis | Psychic · Dark · Ghost · Bug (where it touches) |
| Ice / Dragon | Ice · Dragon · Steel (where it touches) |
| Misc | Normal · Poison · brief cross-group notes |

No single 17-node graph.

### Toggle template (each type)

```
โจมตีด้วย [Type]
- ×2: …
- ×0.5: …
- ×0: …

โดน [Type] เข้า
- ×2 จาก: …
- ×0.5 จาก: …
- ×0 จาก: …
```

Neutral (×1) omitted. Foresight-only Ghost interactions: mention in Ghost/Normal/Fighting toggles or Gen 2 notes, not as default mid-battle fact.

## Labels

Unchanged meanings. Legend callout lives on hub only; children may link back.

## Success criteria

- Hub has no long Johto walkthrough and no large region maps
- Children exist: แผนที่ + Badge 1–8 + League
- Type chart: Mermaid groups via code blocks + 17 dual-perspective toggles + Gen 2 notes
- Labels still present on migrated blocks
- No content orphaned (every moved block has a new home)
- Multipliers match `data/types/type_matchups.asm`

## Risks

| Risk | Mitigation |
|---|---|
| Wrong badge cut (Olivine / Radio Tower) | Cross-links + one primary home |
| Notion API move of images flaky | Prefer native Move / recreate with uploaded images; verify images after migrate |
| Mermaid preview quirks | Code block + Mermaid language; simplify diagrams if preview fails |
| Legacy P/S ≠ vanilla Gen 2 | Check engine; mark `[Legacy ต่าง]` |

## Implementation note

Execution is Notion content work via MCP + optional small repo script to derive toggle/Mermaid text from `type_matchups.asm`. Spec lives in-repo under `docs/superpowers/`; durable play notes remain on Notion.
