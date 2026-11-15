import { appendFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BotHit, WaitlistEntry, WaitlistProvider } from "@/lib/waitlist/types";

/**
 * Development default: append one JSON object per line to a local file in
 * `data/` (gitignored). The file name can be changed with WAITLIST_FILE_NAME.
 * Honeypot hits go to `data/bot-hits.ndjson`.
 * Not suitable for serverless production, where the filesystem is ephemeral.
 */
export function createFileProvider(
  fileName = process.env.WAITLIST_FILE_NAME ?? "waitlist.ndjson",
): WaitlistProvider {
  // Statically scoped to <cwd>/data so the bundler does not trace the whole project.
  const dir = join(process.cwd(), "data");
  const file = join(dir, fileName);
  const botFile = join(dir, "bot-hits.ndjson");
  return {
    name: `file:data/${fileName}`,
    async add(entry: WaitlistEntry) {
      await mkdir(dir, { recursive: true });
      await appendFile(file, JSON.stringify(entry) + "\n", "utf8");
    },
    async has(email: string) {
      let raw: string;
      try {
        raw = await readFile(file, "utf8");
      } catch {
        return false; // No file yet means an empty list.
      }
      for (const line of raw.split("\n")) {
        if (!line.trim()) continue;
        try {
          if ((JSON.parse(line) as { email?: string }).email === email) return true;
        } catch {
          // Skip a corrupt line rather than fail the signup.
        }
      }
      return false;
    },
    async logBot(hit: BotHit) {
      await mkdir(dir, { recursive: true });
      await appendFile(botFile, JSON.stringify(hit) + "\n", "utf8");
    },
  };
}
