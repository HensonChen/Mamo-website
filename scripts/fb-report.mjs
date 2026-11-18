#!/usr/bin/env node
// Readout for the Facebook segment test.
//
// Joins our counted signups (written by the Tally webhook to
// data/signups.ndjson, or to Upstash Redis when SIGNUP_STORE=redis) with an Ads Manager CSV export (one row per ad, with an
// "Ad ID" column) and prints, per segment: spend, real signups, cost per real
// signup with its 95% interval, Meta's own lead count and the gap from ours.
// Signups are counted once per Tally submission id, per segment of the form.
// A signup is "counted" when its ad click is inside the attribution window and
// it is not a test address. Signups can no longer be traced to one ad (the
// webhook has no ad id), so ads are listed with their spend and Meta leads,
// and compared only through their segment.
//
// Usage:
//   node scripts/fb-report.mjs --ads ads.csv [--signups data/signups.ndjson]
//        [--since 2026-12-01] [--until 2026-12-14] [--json]
//
// Where signups come from: the ndjson file by default. With SIGNUP_STORE=redis
// it reads the records the webhook wrote to Upstash Redis (keys signup:<id>,
// ids in the set signups:ids), using KV_REST_API_URL and KV_REST_API_TOKEN.
// Load them first: set -a; source .env.local; set +a   (or `vercel env pull`).
// --signups is ignored in that mode.
//
// The segment of an ad comes from its name: start every ad name with
// "families", "seniors" or "senior-living" (see the README).
//
// Dates: --since and --until filter our signups by their date (UTC). Use the
// same dates for the Ads Manager export. Questions asked in the form (such as
// community name) are in Tally's own export, not here.

import { existsSync, readFileSync } from "node:fs";

const SEGMENTS = ["families", "seniors", "senior-living"];
const SEGMENT_LABEL = { families: "/families", seniors: "/seniors", "senior-living": "/senior-living" };

function parseArgs(argv) {
  const out = { signups: "data/signups.ndjson" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") out.json = true;
    else if (arg === "--help" || arg === "-h") out.help = true;
    else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[++i];
      if (value === undefined) fail(`Missing value for ${arg}`);
      out[key] = value;
    } else fail(`Unexpected argument: ${arg}`);
  }
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readNdjson(path, { optional = false } = {}) {
  if (!existsSync(path)) {
    if (optional) return [];
    fail(`File not found: ${path}`);
  }
  const rows = [];
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line));
    } catch {
      console.error(`Skipping an unreadable line in ${path}`);
    }
  }
  return rows;
}

// Every signup record the webhook wrote to Upstash Redis (see src/lib/signups/redis.ts).
async function readRedis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) fail("SIGNUP_STORE=redis needs KV_REST_API_URL and KV_REST_API_TOKEN in the environment.");
  let Redis;
  try {
    ({ Redis } = await import("@upstash/redis"));
  } catch {
    fail("Run npm install first: @upstash/redis is needed to read from Redis.");
  }
  const redis = new Redis({ url, token });
  const ids = await redis.smembers("signups:ids");
  const rows = [];
  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100);
    const values = await redis.mget(...batch.map((id) => `signup:${id}`));
    values.forEach((value, n) => {
      // The client parses JSON strings; accept a raw string too.
      let record = value;
      if (typeof value === "string") {
        try {
          record = JSON.parse(value);
        } catch {
          record = null;
        }
      }
      if (record && typeof record === "object") rows.push(record);
      else console.error(`Skipping an unreadable or missing record for ${batch[n]}`);
    });
  }
  return rows;
}

const readSignups = async (path) => ((process.env.SIGNUP_STORE || "file") === "redis" ? readRedis() : readNdjson(path));

// Minimal CSV parser: quotes, escaped quotes, commas and newlines inside quotes.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  return rows;
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function findColumn(headers, candidates, { prefix = false } = {}) {
  const keys = headers.map(norm);
  for (const candidate of candidates) {
    const idx = keys.findIndex((k) => (prefix ? k.startsWith(candidate) : k === candidate));
    if (idx !== -1) return idx;
  }
  return -1;
}

const num = (value) => {
  const n = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

function segmentFromName(name) {
  const lower = name.toLowerCase();
  if (lower.includes("senior-living") || lower.includes("senior_living")) return "senior-living";
  if (lower.includes("seniors")) return "seniors";
  if (lower.includes("families")) return "families";
  return undefined;
}

function loadAds(path) {
  if (!path) fail("Pass the Ads Manager export with --ads <file.csv>");
  if (!existsSync(path)) fail(`File not found: ${path}`);
  const rows = parseCsv(readFileSync(path, "utf8"));
  if (rows.length < 2) fail("The Ads Manager CSV has no data rows.");
  const headers = rows[0];
  const col = {
    id: findColumn(headers, ["adid"]),
    name: findColumn(headers, ["adname"]),
    spend: findColumn(headers, ["amountspent"], { prefix: true }),
    impressions: findColumn(headers, ["impressions"]),
    clicks: findColumn(headers, ["linkclicks"]),
    lpv: findColumn(headers, ["landingpageviews"]),
    leads: findColumn(headers, ["websiteleads", "leads"]),
  };
  if (col.id === -1) fail('The CSV needs an "Ad ID" column. In Ads Manager, add it under Columns > Customize.');
  if (col.spend === -1) fail('The CSV needs an "Amount spent" column.');

  const ads = new Map();
  for (const r of rows.slice(1)) {
    const id = (r[col.id] ?? "").trim();
    if (!id) continue;
    const name = col.name === -1 ? id : (r[col.name] ?? id).trim();
    const prior = ads.get(id) ?? { id, name, spend: 0, impressions: 0, clicks: 0, lpv: 0, leads: 0 };
    // A breakdown (by device) repeats an ad over several rows; add them up.
    prior.spend += num(r[col.spend]);
    if (col.impressions !== -1) prior.impressions += num(r[col.impressions]);
    if (col.clicks !== -1) prior.clicks += num(r[col.clicks]);
    if (col.lpv !== -1) prior.lpv += num(r[col.lpv]);
    if (col.leads !== -1) prior.leads += num(r[col.leads]);
    ads.set(id, prior);
  }
  return ads;
}

// 95% interval on a cost per signup built from n signups: x/÷ exp(1.96/sqrt(n)).
function interval(cost, n) {
  if (!n || !Number.isFinite(cost)) return undefined;
  const f = Math.exp(1.96 / Math.sqrt(n));
  return [cost / f, cost * f];
}

const money = (v) => (Number.isFinite(v) ? `$${v.toFixed(2)}` : "n/a");
const pct = (v) => (Number.isFinite(v) ? `${Math.round(v * 100)}%` : "n/a");

function table(headers, rows) {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (cells) => cells.map((c, i) => String(c).padEnd(widths[i])).join("  ");
  return [line(headers), line(widths.map((w) => "-".repeat(w))), ...rows.map(line)].join("\n");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 24).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}

const ads = loadAds(args.ads);
const since = args.since ? Date.parse(`${args.since}T00:00:00Z`) : -Infinity;
const until = args.until ? Date.parse(`${args.until}T23:59:59Z`) : Infinity;
const inRange = (iso) => {
  const t = Date.parse(iso);
  return t >= since && t <= until;
};

const seen = new Set();
const entries = (await readSignups(args.signups)).filter((e) => {
  if (!e.submissionId || seen.has(e.submissionId)) return false; // One signup per Tally submission.
  seen.add(e.submissionId);
  return !e.test && inRange(e.createdAt);
});

const adRows = [...ads.values()].map((row) => ({ ...row, segment: segmentFromName(row.name) }));
const unassigned = adRows.filter((ad) => !ad.segment);

const segmentReports = SEGMENTS.map((segment) => {
  const segmentAds = adRows.filter((ad) => ad.segment === segment);
  const total = segmentAds.reduce(
    (acc, ad) => {
      acc.spend += ad.spend;
      acc.impressions += ad.impressions;
      acc.clicks += ad.clicks;
      acc.lpv += ad.lpv;
      acc.metaLeads += ad.leads;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, lpv: 0, metaLeads: 0, signups: 0 },
  );
  total.signups = entries.filter((e) => e.counted && e.segment === segment).length;
  const organic = entries.filter((e) => !e.counted && e.segment === segment).length;
  const cps = total.signups ? total.spend / total.signups : NaN;
  return {
    segment,
    ads: segmentAds.sort((a, b) => b.spend - a.spend),
    total,
    organic,
    cps,
    cpsInterval: interval(cps, total.signups),
    gap: total.signups ? (total.metaLeads - total.signups) / total.signups : NaN,
    lpvToSignup: total.lpv ? total.signups / total.lpv : NaN,
  };
});

// Decision rule, fixed before launch: lowest cost per signup wins if the
// runner-up costs at least 1.5 times more, or the 95% interval on the ratio of
// their rates excludes 1. Otherwise it is a tie between the top two.
function decide(reports) {
  const ranked = reports.filter((r) => Number.isFinite(r.cps)).sort((a, b) => a.cps - b.cps);
  if (ranked.length < 2) return { verdict: "Not enough data: fewer than two segments have a real signup." };
  const [best, second] = ranked;
  const ratio = second.cps / best.cps;
  const se = Math.sqrt(1 / best.total.signups + 1 / second.total.signups);
  const low = Math.exp(Math.log(ratio) - 1.96 * se);
  const clear = ratio >= 1.5 || low > 1;
  return {
    best: best.segment,
    second: second.segment,
    ratio,
    ratioInterval: [low, Math.exp(Math.log(ratio) + 1.96 * se)],
    verdict: clear
      ? `Winner: ${SEGMENT_LABEL[best.segment]} (runner-up ${SEGMENT_LABEL[second.segment]} costs ${ratio.toFixed(2)} times more).`
      : `Tie between ${SEGMENT_LABEL[best.segment]} and ${SEGMENT_LABEL[second.segment]} (ratio ${ratio.toFixed(2)}). Break it by signup quality, then strategy: the PR names adult children as the likely buyer.`,
    note:
      best.segment === "senior-living" || second.segment === "senior-living"
        ? "Facebook's reach among senior living operators is thin. A weak /senior-living result can be a channel result, not a segment result."
        : undefined,
  };
}
const decision = decide(segmentReports);

if (args.json) {
  console.log(JSON.stringify({ segments: segmentReports, decision, unassigned: unassigned.map((s) => s.id) }, null, 2));
  process.exit(0);
}

console.log("FACEBOOK SEGMENT TEST: cost per real waitlist signup\n");
console.log(
  table(
    ["Segment", "Spend", "Real signups", "Cost per signup", "95% interval", "Meta leads", "Gap vs ours", "Other signups"],
    segmentReports.map((r) => [
      SEGMENT_LABEL[r.segment],
      money(r.total.spend),
      r.total.signups,
      money(r.cps),
      r.cpsInterval ? `${money(r.cpsInterval[0])} to ${money(r.cpsInterval[1])}` : "n/a",
      r.total.metaLeads,
      r.total.signups ? `${r.gap >= 0 ? "+" : ""}${pct(r.gap)}` : "n/a",
      r.organic,
    ]),
  ),
);
console.log("\nA gap above about 20% points to a tracking problem. \"Other signups\" are real submissions that did not come from a paid click in the window.\n");

console.log("Path, per segment");
console.log(
  table(
    ["Segment", "Impressions", "Link clicks", "Landing page views", "Signups per page view"],
    segmentReports.map((r) => [SEGMENT_LABEL[r.segment], r.total.impressions, r.total.clicks, r.total.lpv, pct(r.lpvToSignup)]),
  ),
);

for (const r of segmentReports) {
  if (!r.ads.length) continue;
  console.log(`\nAds in ${SEGMENT_LABEL[r.segment]} (spend and Meta leads; signups are counted per segment, not per ad)`);
  console.log(
    table(
      ["Ad ID", "Ad name", "Spend", "Link clicks", "Meta leads"],
      r.ads.map((ad) => [ad.id, ad.name.slice(0, 32), money(ad.spend), ad.clicks, ad.leads]),
    ),
  );
}

if (unassigned.length) {
  console.log("\nAds whose segment could not be told (name them with a segment prefix):");
  for (const ad of unassigned) console.log(`  ${ad.id}  ${ad.name}  spend: ${money(ad.spend)}`);
}

console.log(`\nDecision: ${decision.verdict}`);
if (decision.ratioInterval) {
  console.log(`  Cost ratio ${decision.ratio.toFixed(2)}, 95% interval ${decision.ratioInterval[0].toFixed(2)} to ${decision.ratioInterval[1].toFixed(2)}.`);
}
if (decision.note) console.log(`  Caveat: ${decision.note}`);
console.log("  Do not stop early because one segment looks ahead; read the result after the planned days.");
