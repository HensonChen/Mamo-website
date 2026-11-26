#!/usr/bin/env node
// End-to-end checks for the Tally signup path. Needs a finished `npm run build`.
//
//   npm run build && node scripts/e2e-tally.mjs
//
// It starts `next start` on its own port with TALLY_SIGNING_SECRET=test and
// META_CAPI_DRY_RUN=1, sends signed sample FORM_RESPONSE bodies to
// /api/tally/webhook, and reads the files the server writes:
//   data/tally-e2e.ndjson     signup log (no email, no hash)
//   data/capi-dry-run.ndjson  the payloads that would go to Meta
// Both files are removed afterwards. Nothing is sent to Tally or Meta.

import { spawn } from "node:child_process";
import { createHash, createHmac } from "node:crypto";
import { existsSync, readFileSync, rmSync } from "node:fs";

const PORT = 3107;
const BASE = `http://127.0.0.1:${PORT}`;
const SECRET = "test";
const SIGNUPS = "data/tally-e2e.ndjson";
const DRY_RUN = "data/capi-dry-run.ndjson";
// The placeholder form ids in src/config/site.ts. Change these if the config has real ids.
const FORM_IDS = { families: "xVDR0d", seniors: "J1l8EK", "senior-living": "BEpjLe" };

let failed = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : detail ? `  (${detail})` : ""}`);
  if (!ok) failed += 1;
};

const lines = (file) =>
  existsSync(file)
    ? readFileSync(file, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l))
    : [];
const rawFile = (file) => (existsSync(file) ? readFileSync(file, "utf8") : "");
const sha256 = (v) => createHash("sha256").update(v).digest("hex");
const sign = (raw, secret = SECRET) => createHmac("sha256", secret).update(raw, "utf8").digest("base64");

function body({ submissionId, email, formId = FORM_IDS.families, fbc, fbp, clickId, segment = "families" }) {
  const fields = [
    { key: "question_a", label: "Your email", type: "INPUT_EMAIL", value: email },
    { key: "h1", label: "segment", type: "HIDDEN_FIELDS", value: segment },
    { key: "h2", label: "fbc", type: "HIDDEN_FIELDS", value: fbc ?? "" },
    { key: "h3", label: "fbp", type: "HIDDEN_FIELDS", value: fbp ?? "" },
    { key: "h4", label: "click_id", type: "HIDDEN_FIELDS", value: clickId ?? "" },
  ];
  return JSON.stringify({
    eventId: `evt_${submissionId}`,
    eventType: "FORM_RESPONSE",
    createdAt: new Date().toISOString(),
    data: { responseId: submissionId, submissionId, respondentId: "r1", formId, formName: "Waitlist", createdAt: new Date().toISOString(), fields },
  });
}

async function post(raw, signature = sign(raw)) {
  const headers = { "content-type": "application/json" };
  if (signature !== null) headers["tally-signature"] = signature;
  const res = await fetch(`${BASE}/api/tally/webhook`, { method: "POST", headers, body: raw });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

async function startServer(env) {
  const child = spawn("npx", ["next", "start", "-p", String(PORT)], {
    env: { ...process.env, ...env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  child.stdout.on("data", (d) => (log += d));
  child.stderr.on("data", (d) => (log += d));
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return child;
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  child.kill();
  throw new Error(`Server did not start:\n${log}`);
}

const stop = (child) =>
  new Promise((resolve) => {
    child.once("exit", resolve);
    child.kill();
    setTimeout(resolve, 2000);
  });

const clean = () => [SIGNUPS, DRY_RUN].forEach((f) => rmSync(f, { force: true }));

async function main() {
  if (!existsSync(".next/BUILD_ID")) throw new Error("Run `npm run build` first.");
  clean();

  const fbc = `fb.1.${Date.now()}.AbCdEf123`;
  const fbp = "fb.1.1700000000000.1234567890";
  const clickId = "0f8fad5b-d9cb-469f-a165-70867728950e"; // a UUID, as the button makes

  // 1. Secret unset: the webhook refuses to run.
  let server = await startServer({ META_CAPI_DRY_RUN: "1", SIGNUPS_FILE_NAME: "tally-e2e.ndjson", TALLY_SIGNING_SECRET: "" });
  try {
    const raw = body({ submissionId: "unset1", email: "a@example.org" });
    check("secret unset gives 503", (await post(raw)).status === 503);
  } finally {
    await stop(server);
  }

  // 2. Secret set.
  server = await startServer({ META_CAPI_DRY_RUN: "1", SIGNUPS_FILE_NAME: "tally-e2e.ndjson", TALLY_SIGNING_SECRET: SECRET });
  try {
    // Pages: no on-site form, a button to the right Tally form.
    // "/" has no audience, so its buttons open the families form.
    for (const [page, segment] of [["families", "families"], ["seniors", "seniors"], ["", "families"]]) {
      const html = await (await fetch(`${BASE}/${page}`)).text();
      check(`/${page} has no <form>`, !/<form[\s>]/i.test(html));
      const hrefs = [...html.matchAll(/href="(https:\/\/tally\.so\/r\/[^"]+)"/g)].map((m) => m[1].replaceAll("&amp;", "&"));
      check(`/${page} has a Tally button with segment=${segment}`, hrefs.length > 0 && hrefs.every((h) => h.includes(`segment=${segment}`) && h.includes(FORM_IDS[segment])), hrefs.join(" | "));
      check(`/${page} does not mention the Meta Lead on load`, !/"Lead"/.test(html));
      check(`/${page} says Mamo, not FamilyIT`, /Mamo/.test(html) && !/FamilyIT/.test(html));
    }
    // The retired page redirects to the home page.
    const gone = await fetch(`${BASE}/senior-living`, { redirect: "manual" });
    check("/senior-living redirects to /", [301, 307, 308].includes(gone.status) && new URL(gone.headers.get("location") ?? "", BASE).pathname === "/", `${gone.status} ${gone.headers.get("location")}`);

    // Signature checks.
    const good = body({ submissionId: "sub1", email: "Person@Example.org", fbc, fbp, clickId });
    check("missing signature gives 401", (await post(good, null)).status === 401);
    check("wrong signature gives 401", (await post(good, sign(good, "nope"))).status === 401);
    check("nothing stored after bad signatures", lines(SIGNUPS).length === 0 && lines(DRY_RUN).length === 0);

    // A real signup.
    const ok = await post(good);
    check("signed FORM_RESPONSE gives 200", ok.status === 200 && ok.json.ok === true, JSON.stringify(ok));
    const stored = lines(SIGNUPS);
    check("one signup line", stored.length === 1);
    check("signup counted for the form's segment", stored[0]?.segment === "families" && stored[0]?.counted === true && stored[0]?.paid === true, JSON.stringify(stored[0]));
    check("signup log has no email or hash", !/person|example\.org|@/i.test(rawFile(SIGNUPS)) && !rawFile(SIGNUPS).includes(sha256("person@example.org")));
    const sent = lines(DRY_RUN);
    check("one Meta payload", sent.length === 1);
    const event = sent[0]?.data?.[0];
    check("event_name is Lead", event?.event_name === "Lead");
    check("event_id is the submission id", event?.event_id === "sub1");
    check("em is the SHA-256 of the lowercased email", event?.user_data?.em?.[0] === sha256("person@example.org"));
    check("fbc and fbp are passed through", event?.user_data?.fbc === fbc && event?.user_data?.fbp === fbp);
    check("external_id is the hashed click id", event?.user_data?.external_id?.[0] === sha256(clickId));
    check("no ip or user agent from the server", !event?.user_data?.client_ip_address && !event?.user_data?.client_user_agent);
    check("plain email absent from the payload", !rawFile(DRY_RUN).toLowerCase().includes("person@example.org"));

    // Duplicate.
    const dup = await post(good);
    check("repeated submission id is ignored", dup.status === 200 && dup.json.ignored === "duplicate", JSON.stringify(dup));
    check("still one signup line and one payload", lines(SIGNUPS).length === 1 && lines(DRY_RUN).length === 1);

    // Test address: stored, never sent, never counted.
    const test = await post(body({ submissionId: "sub2", email: "me+test@example.org", fbc, fbp, clickId }));
    check("test address gives 200", test.status === 200);
    const testRow = lines(SIGNUPS).find((r) => r.submissionId === "sub2");
    check("test address stored as test, not counted", testRow?.test === true && testRow?.counted === false && testRow?.capi === "skipped-test", JSON.stringify(testRow));
    check("test address sent nothing to Meta", lines(DRY_RUN).length === 1);

    // No ad click: a signup, but not counted as paid.
    const organic = await post(body({ submissionId: "sub3", email: "walkin@example.org", segment: "seniors", formId: FORM_IDS.seniors }));
    check("signup without an ad click gives 200", organic.status === 200);
    const organicRow = lines(SIGNUPS).find((r) => r.submissionId === "sub3");
    check("form id decides the segment; no ad click is not counted", organicRow?.segment === "seniors" && organicRow?.counted === false && organicRow?.paid === false, JSON.stringify(organicRow));

    // The retired senior-living form is still accepted, so late submissions are logged.
    const retired = await post(body({ submissionId: "sub3b", email: "late@example.org", segment: "senior-living", formId: FORM_IDS["senior-living"] }));
    const retiredRow = lines(SIGNUPS).find((r) => r.submissionId === "sub3b");
    check("retired senior-living form is still logged", retired.status === 200 && retiredRow?.segment === "senior-living", JSON.stringify(retiredRow));

    // Unknown form, other event type.
    const unknown = await post(body({ submissionId: "sub4", email: "x@example.org", formId: "SOMEOTHERFORM" }));
    check("unknown form is ignored", unknown.status === 200 && unknown.json.ignored === "unknown form" && !lines(SIGNUPS).some((r) => r.submissionId === "sub4"), JSON.stringify(unknown));
    const other = JSON.stringify({ eventType: "FORM_RESPONSE_EDITED", data: {} });
    check("other event types are ignored", (await post(other)).json.ignored !== undefined);

    // Thank-you page.
    const thanks = await (await fetch(`${BASE}/thanks?sid=abc123&seg=families`)).text();
    check("/thanks?sid=abc123 renders the Lead component", /abc123/.test(thanks) && /submissionId/.test(thanks));
    const bare = await (await fetch(`${BASE}/thanks`)).text();
    check("/thanks without sid does not", !/submissionId/.test(bare));
    const bad = await (await fetch(`${BASE}/thanks?sid=${encodeURIComponent("<script>x</script>")}`)).text();
    check("/thanks with a bad sid does not", !/submissionId/.test(bad));
    check("/thanks is noindex", /noindex/.test(thanks));
    const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
    check("sitemap leaves out /thanks", !sitemap.includes("/thanks"));
    check("sitemap leaves out /senior-living", !sitemap.includes("/senior-living"));
  } finally {
    await stop(server);
    clean();
  }

  console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  clean();
  process.exit(1);
});
