import { Redis } from "@upstash/redis";
import type { SignupRecord, SignupStore } from "@/lib/signups/types";

/** One JSON record per signup: `signup:<submissionId>`. */
export const signupKey = (submissionId: string) => `signup:${submissionId}`;
/** The set of every submission id, so a report can list the records. */
export const SIGNUP_IDS_KEY = "signups:ids";

/**
 * Signups in Upstash Redis, over its REST API, for hosts where a file does not
 * persist (Vercel). It uses `KV_REST_API_URL` and `KV_REST_API_TOKEN`, which the
 * Vercel Upstash connection provides. It does not use the read-only token (the
 * webhook writes) or the TCP strings `KV_URL` and `REDIS_URL`.
 *
 * A record has no email and no email hash, same as the file store.
 */
export function createRedisStore(): SignupStore {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("SIGNUP_STORE=redis needs KV_REST_API_URL and KV_REST_API_TOKEN.");
  }
  const redis = new Redis({ url, token });

  return {
    name: "redis:upstash",
    async has(submissionId) {
      return (await redis.exists(signupKey(submissionId))) === 1;
    },
    async add(record: SignupRecord) {
      // NX: a repeated submission id never overwrites the first record.
      await redis.set(signupKey(record.submissionId), JSON.stringify(record), { nx: true });
      // Adding to a set twice is harmless, so a retry also repairs a missing id.
      await redis.sadd(SIGNUP_IDS_KEY, record.submissionId);
    },
  };
}
