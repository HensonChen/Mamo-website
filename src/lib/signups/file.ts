import { appendFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { SignupRecord, SignupStore } from "@/lib/signups/types";

/**
 * Development default: one JSON object per line in `data/signups.ndjson`
 * (gitignored). Not suitable for serverless production, where the filesystem
 * is ephemeral.
 */
export function createFileStore(fileName = process.env.SIGNUPS_FILE_NAME ?? "signups.ndjson"): SignupStore {
  // Statically scoped to <cwd>/data so the bundler does not trace the whole project.
  const dir = join(process.cwd(), "data");
  const file = join(dir, fileName);
  return {
    name: `file:data/${fileName}`,
    async has(submissionId) {
      let raw: string;
      try {
        raw = await readFile(file, "utf8");
      } catch {
        return false; // No file yet means no signups yet.
      }
      for (const line of raw.split("\n")) {
        if (!line.trim()) continue;
        try {
          if ((JSON.parse(line) as { submissionId?: string }).submissionId === submissionId) return true;
        } catch {
          // Skip a corrupt line rather than fail the webhook.
        }
      }
      return false;
    },
    async add(record: SignupRecord) {
      await mkdir(dir, { recursive: true });
      await appendFile(file, JSON.stringify(record) + "\n", "utf8");
    },
  };
}
