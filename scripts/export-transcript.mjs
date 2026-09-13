/**
 * Turns a Claude Code session .jsonl into readable Markdown.
 *
 *   node scripts/export-transcript.mjs docs/session/transcript.jsonl docs/session/transcript.md
 *
 * Base64 image blobs are replaced with a placeholder — they are the bulk of the
 * raw file size and are useless as text.
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error("usage: node scripts/export-transcript.mjs <in.jsonl> <out.md>");
  process.exit(1);
}

const lines = readFileSync(inPath, "utf8").split("\n").filter(Boolean);

/** Pull readable text out of a message's content field. */
function renderContent(content) {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";

  const parts = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;

    switch (block.type) {
      case "text":
        if (block.text?.trim()) parts.push(block.text.trim());
        break;
      case "thinking":
        // Skip reasoning — it is not part of the record being kept.
        break;
      case "image":
        parts.push("_[image]_");
        break;
      case "tool_use": {
        const input = block.input ?? {};
        const summary =
          input.command ?? input.file_path ?? input.pattern ?? input.url ?? "";
        const desc = input.description ? ` — ${input.description}` : "";
        parts.push(
          `> **${block.name}**${desc}` +
            (summary ? `\n> \`\`\`\n> ${String(summary).split("\n").join("\n> ")}\n> \`\`\`` : ""),
        );
        break;
      }
      case "tool_result": {
        let text = "";
        if (typeof block.content === "string") text = block.content;
        else if (Array.isArray(block.content)) {
          text = block.content
            .map((c) => (c?.type === "text" ? c.text : c?.type === "image" ? "[image]" : ""))
            .join("\n");
        }
        text = text.trim();
        if (!text) break;
        // Keep results short; full output lives in the raw .jsonl.
        const clipped = text.length > 1200 ? `${text.slice(0, 1200)}\n… [truncated]` : text;
        parts.push(`<details><summary>result</summary>\n\n\`\`\`\n${clipped}\n\`\`\`\n\n</details>`);
        break;
      }
      default:
        break;
    }
  }
  return parts.join("\n\n");
}

const out = [
  "# Session transcript",
  "",
  `Exported from \`${inPath}\` on ${new Date().toISOString()}.`,
  "Reasoning blocks and base64 image data are omitted; the raw `.jsonl` has everything.",
  "",
  "---",
  "",
];

let userTurn = 0;
for (const line of lines) {
  let entry;
  try {
    entry = JSON.parse(line);
  } catch {
    continue;
  }

  const msg = entry.message;
  if (!msg?.role) continue;

  const body = renderContent(msg.content);
  if (!body) continue;

  if (msg.role === "user") {
    // Tool results come back as "user" messages; only count real prompts.
    const isToolResult = Array.isArray(msg.content)
      && msg.content.every((b) => b?.type === "tool_result");
    if (!isToolResult) {
      userTurn += 1;
      out.push(`## ${userTurn}. User`, "", body, "");
      continue;
    }
    out.push(body, "");
  } else if (msg.role === "assistant") {
    out.push(`### Claude`, "", body, "");
  }
}

writeFileSync(outPath, out.join("\n"), "utf8");
console.log(`wrote ${outPath} (${userTurn} user turns, ${lines.length} raw entries)`);
