// Checks the signup rules against a running site, with plain HTTP (no browser).
// It submits the real forms the way a browser without JavaScript would, with a
// fit_attr cookie it writes itself, and then reads the signup list.
//
//   - counted paid signup for the right ad, on each of the three pages
//   - repeat email: success screen, stored once
//   - honeypot: success screen, not stored, logged as a bot hit
//   - test address, cross-segment, organic, a click older than 7 days, a broken cookie
//   - senior living needs a community name and refuses the "resident" role
//
// Usage:
//   WAITLIST_FILE_NAME=waitlist-e2e.ndjson npm run build
//   WAITLIST_FILE_NAME=waitlist-e2e.ndjson npx next start -p 3100
//   node scripts/e2e-rules.mjs [base-url] [list-file]
//     defaults: http://127.0.0.1:3100  data/waitlist-e2e.ndjson
//
// Leave the Meta environment variables unset: this test must not contact Meta.
// Not covered here (needs a browser): writing the cookie from the ad URL, the
// role swap and the "/" page. scripts/e2e-waitlist.mjs covers those.
import { readFileSync, existsSync } from "node:fs";
const base = process.argv[2] ?? "http://127.0.0.1:3100";
const list = process.argv[3] ?? "data/waitlist-e2e.ndjson";
const stamp = Date.now();
const entries = () => existsSync(list) ? readFileSync(list,"utf8").split("\n").filter(Boolean).map(l=>JSON.parse(l)) : [];
const bots = () => existsSync("data/bot-hits.ndjson") ? readFileSync("data/bot-hits.ndjson","utf8").split("\n").filter(Boolean).length : 0;
let fails = 0;
const check = (n, ok, d="") => { if(!ok) fails++; console.log((ok?"PASS ":"FAIL ")+n+(ok?"":"  "+d)); };

function cookieFor(seg, {ad="ad_"+seg, at=Date.now()} = {}) {
  return "fit_attr=" + encodeURIComponent(JSON.stringify({seg, campaign:"camp1", adset:"set1", ad, placement:"Feed", fbclid:"e2e"+stamp, path:"/"+seg, at}));
}
async function submit(path, fields, cookie="") {
  const page = await fetch(base+path, {headers:{cookie}});
  const html = await page.text();
  const formStart = html.indexOf('data-placement="hero"');
  const open = html.lastIndexOf("<form", formStart);
  const close = html.indexOf("</form>", formStart);
  const form = html.slice(open, close);
  const fd = new FormData();
  for (const m of form.matchAll(/<input[^>]*type="hidden"[^>]*>/g)) {
    const name = /name="([^"]*)"/.exec(m[0])?.[1]; const value = /value="([^"]*)"/.exec(m[0])?.[1] ?? "";
    if (name) fd.append(name, value.replace(/&quot;/g,"\"").replace(/&#x27;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&"));
  }
  for (const [k,v] of Object.entries(fields)) fd.set(k, v);
  const res = await fetch(base+path, {method:"POST", body: fd, headers:{cookie, origin: base}, redirect:"manual"});
  const out = await res.text();
  return { status: res.status, ok: /role="status"/.test(out) && /on the list|You.{1,6}on/.test(out) || /role="status"/.test(out), html: out, hidden: [...form.matchAll(/name="([^"]*)"/g)].map(m=>m[1]).slice(0,8) };
}
const segs = ["families","seniors","senior-living"];
const extra = (s) => s==="senior-living" ? {organization:"E2E Community", residents:"50-99", role:"director"} : {};
const t0 = await submit("/families", {email:"probe"+stamp+"@example.com"});
console.log("probe", t0.status, t0.ok, t0.hidden.join(","));
for (const s of segs) {
  const email = `e2e-${s}-${stamp}@example.com`;
  const r = await submit("/"+s, {email, ...extra(s)}, cookieFor(s));
  const [e] = entries().filter(x=>x.email===email);
  check(`/${s}: success`, r.ok, r.status+" "+r.html.slice(0,0));
  check(`/${s}: counted paid for right ad`, e && e.counted && e.paid && e.variant===s && e.attribution?.ad==="ad_"+s && e.eventName==="Lead" && !!e.eventId, JSON.stringify(e));
  const r2 = await submit("/"+s, {email, ...extra(s)}, cookieFor(s));
  check(`/${s}: repeat success`, r2.ok);
  check(`/${s}: stored once`, entries().filter(x=>x.email===email).length===1);
}
{ const b=bots(); const email=`e2e-bot-${stamp}@example.com`;
  const r = await submit("/families",{email, website:"http://spam"}, cookieFor("families"));
  check("honeypot success", r.ok); check("honeypot not stored", entries().filter(x=>x.email===email).length===0); check("honeypot logged", bots()===b+1, b+"->"+bots()); }
{ const email=`e2e+test${stamp}@example.com`; const r = await submit("/families",{email}, cookieFor("families")); const [e]=entries().filter(x=>x.email===email);
  check("test address success", r.ok); check("test stored as test, not counted, no eventId", e && e.test && !e.counted && !e.eventId, JSON.stringify(e)); }
{ const email=`e2e-cross-${stamp}@example.com`; const r = await submit("/families",{email}, cookieFor("senior-living")); const [e]=entries().filter(x=>x.email===email);
  check("cross success", r.ok); check("cross stored crossSegment, CrossSegmentSignup", e && e.crossSegment && !e.counted && e.eventName==="CrossSegmentSignup" && e.variant==="families" && e.attribution?.seg==="senior-living", JSON.stringify(e)); }
{ const email=`e2e-organic-${stamp}@example.com`; const r = await submit("/seniors",{email}); const [e]=entries().filter(x=>x.email===email);
  check("organic success", r.ok); check("organic: not paid, not counted, Lead", e && !e.paid && !e.counted && e.eventName==="Lead", JSON.stringify(e)); }
{ const email=`e2e-old-${stamp}@example.com`; await submit("/seniors",{email}, cookieFor("seniors",{at:Date.now()-9*86400000})); const [e]=entries().filter(x=>x.email===email);
  check("old click (9 days): treated as organic", e && !e.paid && !e.counted, JSON.stringify(e)); }
{ const email=`e2e-tamper-${stamp}@example.com`; const r = await submit("/seniors",{email}, "fit_attr=%7Bnot-json");
  const [e]=entries().filter(x=>x.email===email); check("tampered cookie: still signs up, not paid", r.ok && e && !e.paid && !e.counted); }
{ const r = await submit("/senior-living",{email:`e2e-noorg-${stamp}@example.com`}, cookieFor("senior-living"));
  check("senior-living without community name: error, not stored", /Enter your community/.test(r.html) && entries().filter(x=>x.email.startsWith("e2e-noorg-"+stamp)).length===0); }
{ const r = await submit("/senior-living",{email:`e2e-cons-${stamp}@example.com`, organization:"X", role:"consumer"}, cookieFor("senior-living"));
  check("senior-living consumer role without JS: error, not stored", /for community staff/.test(r.html) && entries().filter(x=>x.email.startsWith("e2e-cons-"+stamp)).length===0); }
{ const r = await submit("/families",{email:"not-an-email"});
  check("bad email: error", /doesn.{1,6}t look right/.test(r.html)); }
console.log(fails? `${fails} FAILED` : "ALL PASSED");
process.exit(fails ? 1 : 0);
