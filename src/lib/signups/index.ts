import { createFileStore } from "@/lib/signups/file";
import { createRedisStore } from "@/lib/signups/redis";
import type { SignupStore } from "@/lib/signups/types";

export type { CapiOutcome, SignupRecord, SignupStore } from "@/lib/signups/types";

/**
 * Pick the signup store from the environment.
 *
 *   SIGNUP_STORE=file   (default) append to data/signups.ndjson
 *   SIGNUP_STORE=redis  Upstash Redis over REST (Vercel), using
 *                       KV_REST_API_URL and KV_REST_API_TOKEN
 *
 * A file does not persist on serverless hosting, so set `redis` there. A new
 * store needs only `has(submissionId)` and `add(record)`.
 */
export function getSignupStore(): SignupStore {
  const kind = process.env.SIGNUP_STORE || "file";
  switch (kind) {
    case "file":
      return createFileStore();
    case "redis":
      return createRedisStore();
    default:
      throw new Error(
        `Unknown SIGNUP_STORE "${kind}". Implement it in src/lib/signups and register it in src/lib/signups/index.ts.`,
      );
  }
}
