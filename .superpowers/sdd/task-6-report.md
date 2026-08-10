# Task 6 Report — Rebuild type chart on hub

**Status:** DONE_WITH_CONCERNS

## Done via MCP
- Callout (17 types / Foresight) inserted after H2 `ตารางชนะทาง / แพ้ทาง (Gen 2)`
- 5 Mermaid code blocks (Classic, Rock/Ground/Fighting, Psychic axis, Ice/Dragon, Misc)
- Water toggle with dual-perspective lists (verified vs artifact)

## Pending
- 16 remaining type toggles — use `node scripts/notion_type_chart_toggles.mjs` + MCP batches
- Wrap table `4498a510-d356-41aa-85bb-e22b5ceaa7c9` in toggle `ตารางเต็ม (สำรอง)` (Notion UI or API)
- Archive duplicate pre-existing callout `f78aa486-a8d0-4a98-9249-bb9baafcb588`

## Physical/Special Legacy verify
- `engine/battle/effect_commands.asm` `PlayerAttackDamage`: **Ghost → Special, Dark → Physical** (swapped from vanilla Gen 2 table narrative on page)
- **Action:** Update callout `6f53537d-467d-4521-bfca-f1955d102590` with `[Legacy ต่าง]` — MCP `API-update-a-block` rejected callout payload format; **manual edit** recommended
