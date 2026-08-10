# Task 3 Report — Move แผนที่ off hub

**Status:** NEEDS_CONTEXT

## Blockers
1. **Images:** Notion API cannot change block parent; MCP image recreate blocked by Auto-review. **Manual step:** In Notion UI, select hub blocks from H1 `แผนที่` (`b4a62d77`) through divider before `บริการและกิจกรรมประจำ` — use **Move to** → child page `แผนที่` (`3b8da311-a58e-819f-b27c-eb97dbaca47b`). Image block IDs: `3b7da311-a58e-8071-90b0-f207ea6e9a11`, `f17f8c28-13c9-44a6-bffc-0b38965b2df2`, `0763e4c5-cb8b-426c-8618-667c81c35535`.
2. **Bulk text move:** `scripts/notion_hub_migrate.mjs --segment=map` requires `NOTION_API_KEY` (not in shell env; MCP token not exposed).

## Done
- Map child page created (Task 2)
- Migration script with segment bounds documented

## Hub stub
- Not applied yet (depends on content move)
