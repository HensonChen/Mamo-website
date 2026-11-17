import { createFileStore } from "@/lib/signups/file";
import type { SignupStore } from "@/lib/signups/types";

export type { CapiOutcome, SignupRecord, SignupStore } from "@/lib/signups/types";

/**
 * Pick the signup store from the environment.
 *
 *   SIGNUP_STORE=file   (default) append to data/signups.ndjson
 *
 * TODO before launch: on serverless hosting a file does not persist, so add a
 * store backed by a database or KV service and select it here. It needs only
 * `has(submissionId)` and `add(record)`.
 */
export function getSignupStore(): SignupStore {
  const kind = process.env.SIGNUP_STORE ?? "file";
  switch (kind) {
    case "file":
      return createFileStore();
    default:
      throw new Error(
        `Unknown SIGNUP_STORE "${kind}". Implement it in src/lib/signups and register it in src/lib/signups/index.ts.`,
      );
  }
}
