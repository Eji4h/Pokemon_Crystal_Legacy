# Notion hub audit — 2026-08-11

Hub: `3b7da311-a58e-80c2-b287-de7ce0dc63fd`  
Map: `3b8da311-a58e-819f-b27c-eb97dbaca47b`  
Sources: repo `maps/*.asm`, Bulbapedia Dark Cave, pokemoncompletion.com (SPA — little crawlable HTML)

## Fixed

### Map page
- Primary map callout now points hard at [pokemoncompletion Crystal](https://pokemoncompletion.com/completion/Crystal) (overworld + interiors + checklist).
- Replaced stale “GameFAQs 403 / ลาก PNG” callout with note that pokemoncompletion covers interiors; kept GameFAQs image `12376` as Dark Cave backup.
- Rewrote dungeon-section intro; renamed Dark Cave map subsection away from “เรนเดอร์จาก maps/*.blk” WIP wording.
- Expanded Dark Cave requirements: **Flash (HM05 / Sprout Tower 3F)**, **Rock Smash (TM08 / Route 36)**, **BlackGlasses Pharmacist** (Route 45 / Blackthorn Entrance, one-shot event).
- Verified item/warp lists vs `DarkCaveVioletEntrance.asm` + `DarkCaveBlackthornEntrance.asm` — already correct (Potion, Full Heal, Hyper Potion, Dire Hit, hidden Elixer, 4 smash rocks; Revive, TM Snore, BlackGlasses; warps R31 / R46 / internal / R45). No `[Legacy ต่าง]` in those maps.
- Added Surf note for Violet Entrance paths/items (Bulbapedia cross-check).
- Dungeon queue → linked short notes for Union Cave, Slowpoke Well, Burned/Tin Tower, Whirl Islands, Mt. Mortar / Ice Path / Dragon’s Den, Rock Tunnel / Diglett’s Cave / Mt. Silver (all → pokemoncompletion).

### Hub
- Inserted **H1 `Post-game / Kanto`** before the old Kanto block so TOC no longer nests ship/gyms/Mt. Silver under Johto.
- Renamed former H2 to `Kanto — เรือ · ยิม · Mt. Silver`.
- Renamed trailing H1 to `Post-game — GS Ball / Celebi` to avoid duplicate “Post-game” labels.
- Quick links already included pokemoncompletion — left intact.

### Type chart / Legacy
- Confirmed `[Legacy ต่าง]` Ghost→Special / Dark→Physical against `engine/battle/effect_commands.asm` (`PlayerAttackDamage` / `EnemyAttackDamage`). **No edits** (Task 6 preserved).

## Could not verify / limits
- pokemoncompletion is a client-side app; fetch only got shell title — no deep per-dungeon URLs. All dungeon links use the same Crystal map URL + “click location” instructions.
- Notion MCP cannot change block *type* (H2→H1) or reorder arbitrary blocks; Post-game fix = insert new H1 + rename siblings.
- Block delete of stale callout was blocked by safety review; content was rewritten in place instead.
- Did not diff Dark Cave / other dungeons against pret/pokecrystal upstream byte-for-byte (this repo only) — lists match vanilla Bulbapedia Crystal.
- Johto walkthrough page content not fully re-audited beyond structure/parent check (still child of hub).
- Hub still has some block-order quirks (e.g. GS Ball blurb near trailing Post-game; child pages `เดินเนื้อเรื่อง Johto` / `แผนที่` appear late in body while also in sidebar).

## Remaining gaps
- Per-dungeon repo deep-dives (items/warps) for Union Cave, Whirl Islands, Mt. Mortar, Ice Path, etc. — only map pointers added, not ASM-verified lists.
- Upload/host tile-rendered PNGs from `docs/superpowers/artifacts/maps/` into Notion (MCP has no image upload).
- Optional: merge two Post-game H1 sections into one contiguous block (needs manual drag in Notion UI).
- Optional: Surf water-tile proof from `.blk` coordinates for Violet Entrance Potion (noted via Bulbapedia, not tile-parsed).
- Full Johto walkthrough accuracy pass vs Legacy trainer/level changes still open.

## Follow-up
Full-hub audit (services + Johto + Legacy claims): see `notion-audit-full-2026-08-11.md`.  
Johto gym-by-gym walkthrough: see `notion-johto-walkthrough-audit-2026-08-11.md`.  
Post-game Kanto: see `notion-kanto-postgame-audit-2026-08-11.md`.

Post-game Kanto: see `notion-kanto-postgame-audit-2026-08-11.md`.

Official Google Doc digest: `crystal-legacy-official-doc-digest.md` (+ raw `crystal-legacy-gdoc-raw.txt`).
