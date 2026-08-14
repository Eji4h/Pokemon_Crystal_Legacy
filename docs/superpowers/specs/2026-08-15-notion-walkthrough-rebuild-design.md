# Notion Walkthrough Rebuild — Design

**Date:** 2026-08-15  
**Status:** Approved (brainstorming)  
**Old hub (to Archive):** [Pokemon](https://app.notion.com/p/eji4h/Pokemon-3b7da311a58e80c2b287de7ce0dc63fd) (`3b7da311-a58e-80c2-b287-de7ce0dc63fd`)  
**MCP:** `user-Notion Ej!4h` (authenticate if `needsAuth`); prefer `user-Notion Ej!4h (API token)` if that server is listed  
**Walkthrough source:** [Bulbapedia Crystal walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal)

## Problem

The current Notion hub is hard to use: mixed Thai notes, Google Doc, repo checks, Bulbapedia, and pokemoncompletion; Johto is one ~189-block page; MCP cannot restructure old blocks well. Story coverage is thinner than English walkthrough sites.

## Goals

1. Archive the **entire** old hub tree (maps, type chart, QoL, Johto notes) as a readable Archive — do not delete.
2. Build a **new thin hub** plus one Johto page and one Kanto stub.
3. Rebuild story from **English Bulbapedia Crystal walkthrough**, translate to Thai (steps **and** narrative prose), overlay `[Legacy ต่าง]` from Official Google Doc + repo (repo wins).
4. While playing: each Bulbapedia **Part** is a **collapsed toggle**; inside: checklist then full Thai prose.

## Non-goals (this spec / this implementation round)

- Filling Johto Parts 4–15 (follow-up plan after Milestone B)
- Filling Kanto or post-game Johto body (stub toggles/pages only)
- Migrating old map images / type chart / mart tables onto the new hub
- Repo-markdown as source of truth (content is written in Notion)
- ROM / asm changes
- Deleting the old hub or using Notion’s built-in Archive (hides from sidebar)

## Decisions (locked)

| Topic | Choice |
|---|---|
| Story backbone | Bulbapedia Crystal walkthrough (not the Google Doc) |
| Page grain | One page per region (Johto / Kanto) |
| In-page unit | One **toggle per Bulbapedia Part** (not one city; Goldenrod gym vs Radio Tower are different parts) |
| Toggle UX | Whole Part collapsed; open → checklist then Thai prose (narrative included) |
| Checklist placement | Inside that Part’s toggle, above prose — not a dump at the top of the Johto page |
| Archive | Sibling page `Archive`; **move** old hub tree under it |
| New hub | **New page** (new ID). Do not wipe `3b7da311-…` |
| Reference pages | Archive them; rebuild later if needed |
| Content pipeline | Write directly in Notion via MCP |
| Language | Thai sentences; **in-game names stay English** (ROM is English) |
| Vanilla tables | Do **not** copy Bulbapedia wild % or route-trainer parties (Legacy numbers differ) |
| Gym / boss / HM / items | Doc then **repo**; tag `[Legacy ต่าง]` / `[Repo check]` |
| Doc ≠ repo | Believe repo + `[Repo check]` |
| This round | Milestone **A** (IA + empty toggles) + **B** (Parts 1–3 filled) |

## Information architecture

Sibling pages under the **same parent** as the current hub:

```
<parent>
├── Pokemon Crystal Legacy          ← NEW hub (thin)
│   ├── เดินเนื้อเรื่อง Johto
│   └── เดินเนื้อเรื่อง Kanto       ← stub
└── Archive
    └── Pokemon (old hub)           ← 3b7da311-… + children (แผนที่, Johto เดิม, …)
```

### New hub body (only)

1. Short how-to: เปิด toggle ตาม Part ตอนเล่น
2. Page mentions: Johto, Kanto, Archive
3. External links:
   - https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal
   - https://docs.google.com/document/d/1Zku4s049Sri266zr4BhF-riqecOOHjytfZPbQULmcYk/edit
   - https://pokemoncompletion.com/completion/Crystal
4. One callout **เล่น / QoL ทั่วเกม** (needed because old QoL was archived), from Doc, max ~8 bullets: Running Shoes (B), faster Nurse Joy, HMs deletable, TM names visible, Hard Mode / Hardcore one-liners, Ghost=Special / Dark=Physical `[Legacy ต่าง]`

After the new hub exists, update `.cursor/rules/pokemon-crystal-legacy.mdc` URL + page ID to the new hub.

### Johto page

- Top: tag-color legend (same as current rule) + link to Bulbapedia index
- Then **16 collapsed toggles** in play order (titles exact — see outline script):

| Toggle title | Bulbapedia |
|---|---|
| New Bark (Part 1) | Part 1 |
| Cherrygrove (Part 2) | Part 2 |
| Violet (Part 3) | Part 3 |
| Union Cave / Ruins (Part 4) | Part 4 |
| Azalea (Part 5) | Part 5 |
| Goldenrod (Part 6) | Part 6 |
| National Park (Part 7) | Part 7 |
| Ecruteak (Part 8) | Part 8 |
| Olivine (Part 9) | Part 9 |
| Cianwood (Part 10) | Part 10 |
| Mahogany (Part 11) | Part 11 |
| Radio Tower (Part 12) | Part 12 |
| Blackthorn (Part 13) | Part 13 |
| Victory Road (Part 14) | Part 14 |
| Indigo Plateau (Part 15) | Part 15 |
| หลังเกม Johto (GS Ball / Celebi / Tin Tower) | none (stub paragraph: เติมหลัง Johto หลัก) |

Part URL pattern: `https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal/Part_N`

### Inside each filled toggle

1. Paragraph with source link to that Part
2. Heading `Checklist` + tagged bullets (Thai, English names)
3. Heading `เนื้อเรื่อง` + Thai translation of the Part (procedure **and** narrative: town mood, NPC/Team Rocket beats, why the place matters)
4. Do not paste wild encounter tables or every route trainer’s vanilla party
5. Gym / set-piece teams from `data/trainers/parties.asm` (and matching maps)

### Tag colors (mandatory)

Never one `rich_text` span for tag+body.

| Tag | `annotations` |
|---|---|
| `[EVENT]` | `bold` + `color: "blue"` |
| `[ปริศนา]` | `bold` + `color: "orange"` |
| `[สำคัญ]` | `bold` + `color: "brown"` |
| `[Legacy ต่าง]` / `[Legacy]` | `bold` + `color: "red"` |
| `[เสริม]` | `bold` + `color: "green"` |
| `[Repo check]` | `bold` + `color: "purple"` |

Body span: `color: "default"`.

## Content rules

| Kind | Source | Forbidden |
|---|---|---|
| Order, towns, puzzles, who to talk to, lore prose | That Bulbapedia Part | Inventing plot |
| Gym / rival set-piece / Rocket / E4 / key items / HM / mart | Doc, then repo | Pasting Bulbapedia levels/teams as Legacy |
| Hack differences | Legacy fact + `[Legacy ต่าง]` | Vanilla numbers without saying so |
| Doc vs repo | Repo + `[Repo check]` | Changing asm to match Doc |

If a Part fetch fails: stop that Part; do not invent. If unsure Legacy vs vanilla: `[?]` bullet, do not guess.

## Data flow (per filled Part)

Fetch Bulbapedia Part → Thai (steps + narrative) → overlay Legacy from Doc + repo cites → MCP append inside that toggle: checklist then prose.

## Error handling

- Do not restructure old hub blocks; **move the page** into Archive
- If block delete is blocked: move, do not delete
- Notion MCP cannot reliably change block type / reorder: create new pages
- Authenticate MCP before writes

## Milestones / done

| Milestone | Done when |
|---|---|
| **A — IA** | Archive contains old hub; new hub is thin; Johto has 16 empty toggles with titles + Part links; Kanto is a stub page |
| **B — early play** | Parts 1–3 filled (checklist + narrative + verified Legacy); each Part has at least one repo-backed gym/item cite where applicable (Part 3: Falkner + Flash + Togepi) |
| **C** | Parts 4–15 — **out of this plan** |
| **D** | Kanto — **out of this plan** |

Part 3 verification (minimum): Falkner = Pidgey Lv.8 + Noctowl Lv.10 (Berry) in `data/trainers/parties.asm`; HM05 Flash from Sprout Tower; Togepi egg at Violet Center after Falkner.

## Old IDs (must remain reachable under Archive)

```json
{
  "hub": "3b7da311-a58e-80c2-b287-de7ce0dc63fd",
  "map": "3b8da311-a58e-819f-b27c-eb97dbaca47b",
  "johto": "3b8da311-a58e-811f-92dd-cdb621adacd4"
}
```
