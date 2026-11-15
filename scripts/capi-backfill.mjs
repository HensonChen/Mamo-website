#!/usr/bin/env node
// Resend Conversions API events that failed when the signup happened.
//
// The waitlist action logs each failed event to data/capi-failures.ndjson. Meta
// accepts events up to 7 days old, so run this before then. Events that
// succeed are removed from the file; events older than the limit are dropped
// and counted; events that fail again stay for the next run.
//
// Usage (load the same env vars the site uses):
//   set -a; source .env.local; set +a
//   node scripts/capi-backfill.mjs [--dry-run] [--file data/capi-failures.ndjson]
//
// Needs NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN. Optional:
// META_GRAPH_VERSION, META_TEST_EVENT_CODE.

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const fileIdx = argv.indexOf("--file");
const file = fileIdx !== -1 ? argv[fileIdx + 1] : "data/capi-failures.ndjson";

const MAX_AGE_SECONDS = 7 * 24 * 60 * 60 - 60 * 60; // an hour inside Meta's 7-day limit
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const token = process.env.META_CAPI_ACCESS_TOKEN;
const version = process.env.META_GRAPH_VERSION || "v21.0";

if (!existsSync(file)) {
  console.log(`Nothing to resend: ${file} does not exist.`);
  process.exit(0);
}
if (!dryRun && (!pixelId || !token)) {
  console.error("Set NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN, or use --dry-run.");
  process.exit(1);
}

const lines = readFileSync(file, "utf8").split("\n").filter((l) => l.trim());
const now = Math.floor(Date.now() / 1000);
const keep = [];
let sent = 0;
let expired = 0;
let failed = 0;

for (const line of lines) {
  let record;
  try {
    record = JSON.parse(line);
  } catch {
    console.error("Keeping an unreadable line for a person to look at.");
    keep.push(line);
    continue;
  }
  const events = record?.payload?.data ?? [];
  const oldest = Math.min(...events.map((e) => e.event_time ?? 0));
  if (!events.length || now - oldest > MAX_AGE_SECONDS) {
    expired += 1;
    continue;
  }
  if (dryRun) {
    console.log(`Would resend ${events.map((e) => `${e.event_name} ${e.event_id}`).join(", ")}`);
    keep.push(line);
    continue;
  }
  try {
    const url = `https://graph.facebook.com/${version}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`;
    const body = { ...record.payload };
    if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    sent += 1;
  } catch (error) {
    failed += 1;
    console.error(`Failed again: ${events.map((e) => e.event_id).join(", ")} (${error instanceof Error ? error.message : "error"})`);
    keep.push(line);
  }
}

if (!dryRun) writeFileSync(file, keep.length ? keep.join("\n") + "\n" : "", "utf8");
console.log(
  dryRun
    ? `Dry run: ${keep.length} event line(s) could be resent, ${expired} too old.`
    : `Resent ${sent}, failed again ${failed}, dropped ${expired} older than Meta's limit.`,
);
