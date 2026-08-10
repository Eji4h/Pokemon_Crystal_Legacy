#!/usr/bin/env node
/** Parse gen2-type-chart-notion.md → Notion toggle block payloads (stdout JSON). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const md = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs/superpowers/artifacts/gen2-type-chart-notion.md"),
  "utf8",
);

const toggles = [];
for (const chunk of md.split("## Toggle: ").slice(1)) {
  const name = chunk.split("\n")[0].trim();
  const body = chunk.split("## Toggle:")[0];
  const atk = body.match(/### โจมตีด้วย[^\n]*\n([\s\S]*?)### โดน/)?.[1] ?? "";
  const def = body.match(/### โดน[^\n]*\n([\s\S]*?)$/)?.[1] ?? "";
  const lines = [...atk.trim().split("\n"), ...def.trim().split("\n")].filter(Boolean);
  toggles.push({
    type: "toggle",
    toggle: {
      rich_text: [{ type: "text", text: { content: name } }],
      children: lines.map((line) => ({
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: line.replace(/^- /, "") } }],
        },
      })),
    },
  });
}
console.log(JSON.stringify(toggles, null, 2));
