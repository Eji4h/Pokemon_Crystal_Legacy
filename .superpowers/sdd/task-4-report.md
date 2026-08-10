# Task 4 Report — Migrate walkthrough Badge 1–4

**Status:** NEEDS_CONTEXT

## Done (sample)
- Badge 1 child: Goal callout + one `[EVENT]` bullet copied via MCP (partial)

## Blocker
- ~70+ blocks across badge1–4; MCP-only copy is O(n) API calls. Run:
  ```bash
  NOTION_API_KEY=<integration token> node scripts/notion_hub_migrate.mjs --segment=badge1
  # repeat badge2 badge3 badge4
  ```
- Then add Prev/Next footers per plan (MCP or script extension)

## Segment bounds (hub H2 start IDs)
- badge1: `b866213a` → `8af89dfb`
- badge2: `8af89dfb` → `65e704e1`
- badge3: `65e704e1` → `17c45dfa` (note: badge3 H2 is `17c45dfa` Ilex/Goldenrod — plan lists badge3 as Ilex; badge4 starts `f907ec23`)
- badge4: `f907ec23` → `7f354a5d`
