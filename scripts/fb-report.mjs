#!/usr/bin/env node
// Readout for the Facebook segment test.
//
// Joins our counted waitlist signups with an Ads Manager CSV export (one row
// per ad, with an "Ad ID" column) and prints, per segment and per ad: spend,
// real signups, cost per real signup with its 95% interval, Meta's own lead
// count and the gap from ours, iPhone signups, bot hits and cross-segment
// signups. It ranks ads only inside their own segment.
//
// Usage:
//   node scripts/fb-report.mjs --ads ads.csv [--waitlist data/waitlist.ndjson]
//        [--bots data/bot-hits.ndjson] [--since 2026-12-01] [--until 2026-12-14] [--json]
//
// The segment of an ad comes from its name: start every ad name with
// "families", "seniors" or "senior-living" (see the README). An ad with a
// different name takes the segment from its signups, if it has any.
//
// Dates: --since and --until filter our signups by their date (UTC). Use the
// same dates for the Ads Manager export.

import { existsSync, readFileSync } from "node:fs";

const SEGMENTS = ["families", "seniors", "senior-living"];
const SEGMENT_LABEL = { families: "/families", seniors: "/seniors", "senior-living": "/senior-living" };

function parseArgs(argv) {
  const out = { waitlist: "data/waitlist.ndjson", bots: "data/bot-hits.ndjson" };
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
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 22).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}

const ads = loadAds(args.ads);
const since = args.since ? Date.parse(`${args.since}T00:00:00Z`) : -Infinity;
const until = args.until ? Date.parse(`${args.until}T23:59:59Z`) : Infinity;
const inRange = (iso) => {
  const t = Date.parse(iso);
  return t >= since && t <= until;
};

const entries = readNdjson(args.waitlist).filter((e) => !e.test && inRange(e.createdAt));
const botHits = readNdjson(args.bots, { optional: true }).filter((b) => inRange(b.at));

// Each ad starts from its CSV row, then gains our counts.
const stats = new Map();
const statFor = (id) => {
  if (!stats.has(id)) {
    const row = ads.get(id);
    stats.set(id, {
      id,
      name: row?.name ?? "(not in the CSV)",
      inCsv: Boolean(row),
      segment: row ? segmentFromName(row.name) : undefined,
      spend: row?.spend ?? 0,
      impressions: row?.impressions ?? 0,
      clicks: row?.clicks ?? 0,
      lpv: row?.lpv ?? 0,
      metaLeads: row?.leads ?? 0,
      signups: 0,
      iphone: 0,
      crossSegment: { families: 0, seniors: 0, "senior-living": 0 },
    });
  }
  return stats.get(id);
};
for (const id of ads.keys()) statFor(id);

for (const e of entries) {
  const adId = e.attribution?.ad;
  if (!adId) continue;
  if (!e.counted && !e.crossSegment) continue;
  const s = statFor(adId);
  if (!s.segment && e.attribution?.seg) s.segment = e.attribution.seg;
  if (e.counted) {
    s.signups += 1;
    if (e.device === "iphone") s.iphone += 1;
  } else if (e.crossSegment) {
    s.crossSegment[e.variant] += 1;
  }
}

const unassigned = [...stats.values()].filter((s) => !s.segment);
const segmentReports = SEGMENTS.map((segment) => {
  const adRows = [...stats.values()].filter((s) => s.segment === segment);
  const total = adRows.reduce(
    (acc, s) => {
      acc.spend += s.spend;
      acc.impressions += s.impressions;
      acc.clicks += s.clicks;
      acc.lpv += s.lpv;
      acc.signups += s.signups;
      acc.iphone += s.iphone;
      acc.metaLeads += s.metaLeads;
      for (const k of SEGMENTS) acc.cross[k] += s.crossSegment[k];
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, lpv: 0, signups: 0, iphone: 0, metaLeads: 0, cross: { families: 0, seniors: 0, "senior-living": 0 } },
  );
  const cps = total.signups ? total.spend / total.signups : NaN;
  const crossTotal = SEGMENTS.reduce((n, k) => n + total.cross[k], 0);
  const segmentEntries = entries.filter((e) => e.counted && e.variant === segment);
  let quality;
  if (segment === "senior-living") {
    quality = segmentEntries.length
      ? segmentEntries.filter((e) => e.organization && e.residents).length / segmentEntries.length
      : NaN;
  } else if (segment === "families") {
    quality = segmentEntries.length ? segmentEntries.filter((e) => e.whoFor).length / segmentEntries.length : NaN;
  }
  return {
    segment,
    ads: adRows.sort((a, b) => {
      const ca = a.signups ? a.spend / a.signups : Infinity;
      const cb = b.signups ? b.spend / b.signups : Infinity;
      return ca - cb;
    }),
    total,
    cps,
    cpsInterval: interval(cps, total.signups),
    gap: total.signups ? (total.metaLeads - total.signups) / total.signups : NaN,
    spillover: total.signups + crossTotal ? crossTotal / (total.signups + crossTotal) : NaN,
    quality,
    bots: botHits.filter((b) => b.variant === segment).length,
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
    ["Segment", "Spend", "Real signups", "Cost per signup", "95% interval", "Meta leads", "Gap vs ours", "iPhone", "Bots", "Spillover"],
    segmentReports.map((r) => [
      SEGMENT_LABEL[r.segment],
      money(r.total.spend),
      r.total.signups,
      money(r.cps),
      r.cpsInterval ? `${money(r.cpsInterval[0])} to ${money(r.cpsInterval[1])}` : "n/a",
      r.total.metaLeads,
      r.total.signups ? `${r.gap >= 0 ? "+" : ""}${pct(r.gap)}` : "n/a",
      r.total.iphone,
      r.bots,
      pct(r.spillover),
    ]),
  ),
);
console.log("\nA gap above about 20% points to a tracking problem.\n");

console.log("Path and quality, per segment");
console.log(
  table(
    ["Segment", "Impressions", "Link clicks", "Landing page views", "Signups per page view", "Signup quality"],
    segmentReports.map((r) => [
      SEGMENT_LABEL[r.segment],
      r.total.impressions,
      r.total.clicks,
      r.total.lpv,
      pct(r.lpvToSignup),
      r.quality === undefined ? "n/a (no optional question)" : pct(r.quality),
    ]),
  ),
);

console.log("\nCross-segment signups, by the page they actually signed up for");
console.log(
  table(
    ["Ad segment", "-> /families", "-> /seniors", "-> /senior-living"],
    segmentReports.map((r) => [SEGMENT_LABEL[r.segment], r.total.cross.families, r.total.cross.seniors, r.total.cross["senior-living"]]),
  ),
);

for (const r of segmentReports) {
  if (!r.ads.length) continue;
  console.log(`\nAds in ${SEGMENT_LABEL[r.segment]} (ranked inside this segment only; directional)`);
  console.log(
    table(
      ["Ad ID", "Ad name", "Spend", "Real signups", "Cost per signup", "95% interval", "Meta leads", "iPhone"],
      r.ads.map((s) => {
        const cost = s.signups ? s.spend / s.signups : NaN;
        const ci = interval(cost, s.signups);
        return [s.id, s.name.slice(0, 32), money(s.spend), s.signups, money(cost), ci ? `${money(ci[0])} to ${money(ci[1])}` : "n/a", s.metaLeads, s.iphone];
      }),
    ),
  );
}

if (unassigned.length) {
  console.log("\nAds whose segment could not be told (name them with a segment prefix):");
  for (const s of unassigned) console.log(`  ${s.id}  ${s.name}  signups: ${s.signups}`);
}

console.log(`\nDecision: ${decision.verdict}`);
if (decision.ratioInterval) {
  console.log(`  Cost ratio ${decision.ratio.toFixed(2)}, 95% interval ${decision.ratioInterval[0].toFixed(2)} to ${decision.ratioInterval[1].toFixed(2)}.`);
}
if (decision.note) console.log(`  Caveat: ${decision.note}`);
console.log("  Do not stop early because one segment looks ahead; read the result after the planned days.");
