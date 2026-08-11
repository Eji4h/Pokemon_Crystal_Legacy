# SDD Progress — Notion Hub Reorg

Branch: `personal/notes`  
Updated: 2026-08-11 (corrected — region-level single page)

## Tasks

| Task | Status | Notes |
|------|--------|-------|
| 1 | **DONE** | commit `89b431d` — type chart generator + tests |
| 2 | **DONE** | commit `53316f7` — 10 child pages + `notion-child-ids.json` |
| 3 | **DONE** (human images) | Map text on child page; hub stub + link; **3 map images remain on hub** — manual Move |
| 4 | **SUPERSEDED** | Per-badge child pages replaced by single Johto page (see correction below) |
| 5 | **SUPERSEDED** | — |
| 6 | **DONE** | 5 Mermaid + 17 type toggles + backup toggle + Legacy P/S callout |
| 7 | **DONE** (revised) | Hub Johto nav = **one** page-mention bullet → `เดินเนื้อเรื่อง Johto` |
| 8 | **DONE** | Merged badge1–8 + league into single Johto page; archived 9 source pages |

## Correction: region-level single page (2026-08-11)

User requested **one page per region** for story, not Badge 1–8 subpages.

- **Johto page:** `3b8da311-a58e-811f-92dd-cdb621adacd4` (`เดินเนื้อเรื่อง Johto`) — ~189 blocks merged from `hub-blocks-full.json` + goal callouts
- **Archived:** badge1–8 + league (9 source pages)
- **Hub nav:** one bullet under H1 `เดินเนื้อเรื่อง Johto`; Quick links callout updated (no Badge 1–8)
- **IDs:** `docs/superpowers/artifacts/notion-child-ids.json` → `{ hub, map, johto }`

## Driver state (prior per-badge migration)

- Script: `scripts/notion_mcp_driver.mjs` + `notion_mcp_run_loop.mjs`
- State: `docs/superpowers/artifacts/mcp-migrate-state.json` → **`{done:true}`** (superseded by single-page merge)

## Segment counts (final)

| Segment | Migrated | Hub deleted |
|---------|----------|-------------|
| badge1 | 5 | 5 |
| badge2 | 6 | 6 |
| badge3 | 5 | 5 |
| badge4 | 58 | 57 |
| badge5 | 28 | 27 |
| badge6 | 6 | 5 |
| badge7 | 7 | 6 |
| badge8 | 55 | 54 |
| league | 10 | 9 |

## Commits

- `89b431d` Task 1
- `53316f7` Task 2 + migration helpers
- No commit yet for Tasks 3–7 Notion MCP work (user did not request)

## Human-only

1. **Move 3 map images** hub → child `แผนที่`:
   - `3b7da311-a58e-8071-90b0-f207ea6e9a11`
   - `f17f8c28-13c9-44a6-bffc-0b38965b2df2`
   - `0763e4c5-cb8b-426c-8618-667c81c35535`
