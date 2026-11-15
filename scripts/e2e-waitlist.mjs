// End-to-end check of the three segment forms and the signup rules, driven
// through headless Chrome over the DevTools protocol.
//
// It checks, for each page: the fit_attr cookie from a paid-ad URL, a counted
// signup, a repeat email, the honeypot, a test address, a cross-segment signup,
// an organic signup, the senior-living "resident or family member" swap, and
// that "/" has no form and leaves the cookie alone.
//
// Usage:
//   1. Start the site with a throwaway list so real data is untouched:
//        WAITLIST_FILE_NAME=waitlist-e2e.ndjson npm run dev   (or: npm run build && npm start)
//   2. Start Chrome with --headless=new --remote-debugging-port=9333
//   3. node scripts/e2e-waitlist.mjs [base-url] [data-dir]
//        defaults: http://localhost:3000  data
//
// Exits non-zero if any check fails. Meta is not contacted unless the Meta
// environment variables are set on the server; leave them unset for this test.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const dataDir = process.argv[3] ?? "data";
const listFile = join(dataDir, process.env.WAITLIST_FILE_NAME ?? "waitlist-e2e.ndjson");
const botFile = join(dataDir, "bot-hits.ndjson");
const shotDir = process.env.E2E_SHOTS;

const targets = await (await fetch("http://127.0.0.1:9333/json")).json();
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let nextId = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const res = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (res.result.exceptionDetails) throw new Error(JSON.stringify(res.result.exceptionDetails));
  return res.result.result.value;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `  (${detail})`}`);
};

const readEntries = () =>
  existsSync(listFile)
    ? readFileSync(listFile, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l))
    : [];
const entryFor = (email) => readEntries().filter((e) => e.email === email);
const botCount = () => (existsSync(botFile) ? readFileSync(botFile, "utf8").split("\n").filter(Boolean).length : 0);

await send("Page.enable");
await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

const open = async (path) => {
  await send("Page.navigate", { url: `${base}${path}` });
  await sleep(2500); // let hydration finish so the form action is wired up
};
const cookieValue = () =>
  evaluate(`(document.cookie.split('; ').find(c => c.startsWith('fit_attr=')) || '').slice(9)`);

const stamp = Date.now();
const adUrl = (seg, path = `/${seg}`) =>
  `${path}?utm_source=facebook&utm_medium=paid_social&utm_campaign=camp1&utm_term=set1&utm_content=ad_${seg}&fit_seg=${seg}&fit_place=Feed&fbclid=e2e${stamp}`;

/** Fill and submit the hero form. Returns the first visible result text. */
async function submit(segment, email, { honeypot = false, role = "" } = {}) {
  const outcome = await evaluate(`(async () => {
    const form = document.querySelector('form[data-placement=hero]');
    if (!form) return 'no-form';
    const set = (el, value) => {
      if (!el) return;
      const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    set(form.querySelector('input[name=email]'), ${JSON.stringify(email)});
    set(form.querySelector('input[name=organization]'), 'E2E Community');
    set(form.querySelector('select[name=residents]'), '50-99');
    set(form.querySelector('select[name=role]'), ${JSON.stringify(role)});
    ${honeypot ? `set(form.querySelector('input[name=website]'), 'http://spam.example');` : ""}
    form.querySelector('button[type=submit]').click();
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 250));
      const ok = document.querySelector('[role=status]:not([data-testid])');
      if (ok) return 'success: ' + ok.textContent.trim().slice(0, 80);
      const err = document.querySelector('form[data-placement=hero] [role=alert]');
      if (err) return 'error: ' + err.textContent.trim();
    }
    return 'timeout';
  })()`);
  return outcome;
}

const segments = ["families", "seniors", "senior-living"];

// 1-3. Each page: cookie, counted signup, repeat email.
for (const seg of segments) {
  await send("Network.clearBrowserCookies");
  await open(adUrl(seg));
  const raw = decodeURIComponent(await cookieValue());
  let attr = {};
  try {
    attr = JSON.parse(raw);
  } catch {}
  check(`/${seg}: fit_attr cookie holds the ad`, attr.seg === seg && attr.ad === `ad_${seg}` && attr.campaign === "camp1" && attr.adset === "set1", raw);

  const email = `e2e-${seg}-${stamp}@example.com`;
  const outcome = await submit(seg, email);
  check(`/${seg}: signup shows the success screen`, outcome.startsWith("success"), outcome);
  const [entry] = entryFor(email);
  check(
    `/${seg}: stored as a counted, paid signup for the right ad`,
    Boolean(entry) && entry.counted === true && entry.paid === true && entry.variant === seg && entry.attribution?.ad === `ad_${seg}` && entry.eventName === "Lead" && Boolean(entry.eventId),
    JSON.stringify(entry),
  );
  check(`/${seg}: desktop browser detected`, entry?.device === "desktop", entry?.device);
  if (seg === "senior-living") {
    check("/senior-living: community name stored", entry?.organization === "E2E Community" && entry?.residents === "50-99");
  }
  if (shotDir) {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(shotDir, `e2e-${seg}-success.png`), Buffer.from(shot.result.data, "base64"));
  }

  // Repeat email: same success screen, one stored entry.
  await open(adUrl(seg));
  const again = await submit(seg, email);
  check(`/${seg}: repeat email shows success`, again.startsWith("success"), again);
  check(`/${seg}: repeat email is stored once`, entryFor(email).length === 1, String(entryFor(email).length));
}

// 4. Honeypot.
{
  await send("Network.clearBrowserCookies");
  await open(adUrl("families"));
  const before = botCount();
  const email = `e2e-bot-${stamp}@example.com`;
  const outcome = await submit("families", email, { honeypot: true });
  check("honeypot: shows the success screen", outcome.startsWith("success"), outcome);
  check("honeypot: nothing stored as a signup", entryFor(email).length === 0);
  check("honeypot: logged as a bot hit", botCount() === before + 1, `${before} -> ${botCount()}`);
}

// 5. Test address.
{
  await send("Network.clearBrowserCookies");
  await open(adUrl("families"));
  const email = `e2e+test${stamp}@example.com`;
  const outcome = await submit("families", email);
  const [entry] = entryFor(email);
  check("test address: shows success", outcome.startsWith("success"), outcome);
  check("test address: stored as a test, not counted, no event id", Boolean(entry) && entry.test === true && entry.counted === false && !entry.eventId, JSON.stringify(entry));
}

// 6. Cross-segment: a senior-living ad, then a signup on /families.
{
  await send("Network.clearBrowserCookies");
  await open(adUrl("senior-living"));
  await open("/families"); // follow to another page: the cookie must survive
  const email = `e2e-cross-${stamp}@example.com`;
  const outcome = await submit("families", email);
  const [entry] = entryFor(email);
  check("cross-segment: shows success", outcome.startsWith("success"), outcome);
  check(
    "cross-segment: stored as cross-segment, not counted, CrossSegmentSignup",
    Boolean(entry) && entry.crossSegment === true && entry.counted === false && entry.eventName === "CrossSegmentSignup" && entry.variant === "families" && entry.attribution?.seg === "senior-living",
    JSON.stringify(entry),
  );
}

// 7. Organic: no cookie at all.
{
  await send("Network.clearBrowserCookies");
  await open("/seniors");
  const email = `e2e-organic-${stamp}@example.com`;
  const outcome = await submit("seniors", email);
  const [entry] = entryFor(email);
  check("organic: shows success", outcome.startsWith("success"), outcome);
  check("organic: stored, not paid, not counted, Lead sent", Boolean(entry) && entry.paid === false && entry.counted === false && entry.eventName === "Lead", JSON.stringify(entry));
}

// 8. Senior living: "I'm a resident or family member" swaps the button for the doors.
{
  await send("Network.clearBrowserCookies");
  await open("/senior-living");
  const swap = await evaluate(`(async () => {
    const form = document.querySelector('form[data-placement=hero]');
    const select = form.querySelector('select[name=role]');
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(select, 'consumer');
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    return JSON.stringify({
      swap: Boolean(form.querySelector('[data-testid=consumer-swap]')),
      submit: Boolean(form.querySelector('button[type=submit]')),
      links: [...form.querySelectorAll('[data-testid=consumer-swap] a')].map(a => a.getAttribute('href')),
    });
  })()`);
  const s = JSON.parse(swap);
  check("senior-living: resident role shows the two consumer doors", s.swap && !s.submit && s.links.includes("/seniors") && s.links.includes("/families"), swap);
}

// 9. "/" has no form, three correct doors, and leaves the cookie unchanged.
{
  await send("Network.clearBrowserCookies");
  await open(adUrl("seniors"));
  const before = await cookieValue();
  await open("/");
  const home = JSON.parse(
    await evaluate(`JSON.stringify({
      forms: document.querySelectorAll('form').length,
      doors: [...document.querySelectorAll('main a')].map(a => a.getAttribute('href')),
    })`),
  );
  const after = await cookieValue();
  check("/: has no form", home.forms === 0, String(home.forms));
  check("/: three doors open the segment pages", ["/families", "/seniors", "/senior-living"].every((h) => home.doors.includes(h)), JSON.stringify(home.doors));
  check("/: visiting it leaves fit_attr unchanged", Boolean(before) && before === after);
}

// 10. Wrong-door line on each page links to the other two pages.
for (const seg of segments) {
  await open(`/${seg}`);
  const links = JSON.parse(await evaluate(`JSON.stringify([...document.querySelectorAll('[data-testid=wrong-door] a')].map(a => a.getAttribute('href')))`));
  const others = segments.filter((s) => s !== seg).map((s) => `/${s}`);
  check(`/${seg}: "Not you?" line links to the other pages`, others.every((o) => links.includes(o)), JSON.stringify(links));
}

ws.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length} of ${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
