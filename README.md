# FamilyIT waitlist site

Pre-launch site and waitlist for FamilyIT, a voice-and-screen AI tech helper
for older adults. It has three landing pages, one per go-to-market segment,
built to test which segment signs up at the lowest cost on Facebook:

| Route | Segment | Who it is for |
| --- | --- | --- |
| `/families` | Adult children | "Be their family, not their help desk." |
| `/seniors` | Older adults | "Tech help whenever you need it. Just talk." |
| `/senior-living` | Senior living operators | "Tech help for every resident. Time back for your staff." |
| `/` | none | A one-screen chooser with three doors. No form. Never an ad destination. |

Next.js (App Router), TypeScript, Tailwind CSS. Static pages plus one server
action for the waitlist. No CMS, auth or database.

## Run it

Requires Node.js 20.9 or newer (Next.js 16's minimum) and npm.

```bash
git clone git@github.com:HensonChen/familyit-landing.git
cd familyit-landing
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
npm start
```

Waitlist signups are appended to `data/waitlist.ndjson` (gitignored) by
default. See `src/lib/waitlist/README.md` to plug in a real provider.

No environment variables are needed to run locally, and the site works with
every Meta variable below unset. `.env*` files are gitignored; put keys in
`.env.local`.

## Editing the site

| To change… | Edit |
| --- | --- |
| Facts: domain, contact email, launch window, prices, safety wording, test addresses | `src/config/site.ts` |
| Everything a segment page says (headline, captions, answers, questions, form fields, "Not you?" line) | `src/content/variants.ts` |
| Form option lists (who it is for, residents, role, offer model) | `src/content/audiences.ts` |
| The phone pictures | `src/components/phone/` |
| Page layout and styling | `src/components/landing/`, `src/app/globals.css` |
| Privacy and terms text | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` |

The three pages share one template (`VariantPage`) so that results differ
because of words and pictures, not layout. Price, trial and safety wording are
written once in `siteConfig.product` and referenced from the content file.

Old `/solutions/*` URLs redirect (see `next.config.ts`): seniors to
`/seniors`, care centers to `/senior-living`, the two removed audiences to `/`.

## Facebook test: setup checklist

Paid ads send to the three segment pages only, never to `/`. Decision metric:
cost per real waitlist signup.

1. **Environment variables** (host settings or `.env.local`):
   - `NEXT_PUBLIC_META_PIXEL_ID`: the Pixel id. Loads the Pixel.
   - `META_CAPI_ACCESS_TOKEN`: server-only secret for the Conversions API.
   - `META_TEST_EVENT_CODE`: set only while checking events in Events
     Manager's Test Events tab. Remove it afterwards.
   - `META_GRAPH_VERSION`: optional, defaults to the version in
     `src/lib/meta/capi.ts`. Check it against Meta's current docs.
2. **Production waitlist provider** with `has(email)`. The file provider does
   not persist on serverless hosting.
3. **Team addresses** in `siteConfig.tracking.testEmails`. Any address with
   `+test` in it is treated as a test too.
4. **Privacy and terms**: replace the placeholder notice. The privacy page
   already describes the Pixel, the Conversions API and the hashed email.
5. **Ad URLs.** Each ad's URL parameters:

   ```
   utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_term={{adset.id}}&utm_content={{ad.id}}&fit_seg=<segment>&fit_place={{placement}}
   ```

   `<segment>` is `families`, `seniors` or `senior-living`, and the ad must
   open that segment's page.
6. **Name every ad with its segment first**, for example `families_concept1_a`,
   `seniors_concept1_a`, `senior-living_concept1_a`. The report reads the
   segment from the name.
7. **Ads Manager**: 7-day click attribution, 1-day view off. Columns: Ad ID,
   Ad name, Amount spent, Impressions, Link clicks, Landing page views, Website
   leads. Add a breakdown by impression device to compare iPhone counts. Export
   a CSV by ad id.
8. **Domain verification** in Business Manager. If Events Manager still shows
   Aggregated Event Measurement settings, put `Lead` first.
9. **Smoke test before spending**: with `META_TEST_EVENT_CODE` set, submit one
   signup on each page from a desktop and from a real iPhone (tap a test ad or
   open a URL with `fbclid` and the `fit_*` parameters from Facebook's app).
   Confirm each event appears in Test Events with one event id, from both the
   browser and the server. Watch for restriction warnings in Events Manager.

### How a signup is counted

The waitlist action (`src/app/actions/waitlist.ts`) decides in this order:

1. Honeypot filled: shows success, stores nothing, sends no event, logs a bot
   hit (`data/bot-hits.ndjson`).
2. Validation fails: shows the errors.
3. Email already on the list: shows success, sends no event.
4. Test address: stored as a test, sends no event.
5. The ad's segment (from the `fit_attr` cookie) differs from the form's
   segment: stored as cross-segment, sends `CrossSegmentSignup`, not counted.
6. No paid click within 7 days: stored, sends `Lead`, not counted. This is
   organic and `/` traffic.
7. Otherwise: stored as **counted**, sends `Lead` from the browser and the
   server with the same event id.

`AttributionCapture` writes `fit_attr` only on the three segment pages and only
when the URL has `fit_seg` plus `utm_medium=paid_social` or `fbclid`. The cookie
lasts 30 days, the last paid click wins, and visiting `/` never changes it.

### Reading the result

```bash
node scripts/fb-report.mjs --ads ads-export.csv \
  --since 2026-12-01 --until 2026-12-14
```

Add `--json` for machine-readable output. Run it again 7 days after the last
ad day, because Ads Manager can revise iPhone results for up to 72 hours. The
report shows, per segment: spend, real signups, cost per signup with a 95%
interval, Meta's leads and the gap from ours (above about 20% means check
tracking), iPhone signups, bot hits, spillover, and signup quality. Ads are
ranked only inside their own segment, and that ranking is directional.

Decision rule (fixed before launch): the segment with the lowest cost per
signup wins if the runner-up costs at least 1.5 times more, or the 95% interval
on the cost ratio excludes 1. Otherwise it is a tie, broken by signup quality
and then strategy. Do not stop early. A weak `/senior-living` result can be a
channel result, since Facebook's reach among operators is thin.

If a Conversions API call failed, the event is kept in
`data/capi-failures.ndjson`. Resend while Meta still accepts it (7 days):

```bash
set -a; source .env.local; set +a
node scripts/capi-backfill.mjs --dry-run   # look first
node scripts/capi-backfill.mjs
```

On a read-only host the failure is only in the server log; copy the event ids
from there.

## Before launch: placeholders

Everything factual lives in **`src/config/site.ts`**; search for `PLACEHOLDER`:
the domain, legal name, contact email, socials, launch window, regions, prices
and trial wording, community pricing and pilot notes, and test addresses.

Also: the privacy and terms pages show a visible "Placeholder" notice from
`src/components/legal-page.tsx`. Remove it once the text is reviewed.

## Design

- Typeface: Atkinson Hyperlegible, designed by the Braille Institute for
  low-vision readers. Body text is 18px, buttons are 64px tall, focus rings are
  thick, and the helper character stops moving for visitors who prefer reduced
  motion.
- Palette (from the `WireframeDemoStyled2` mockup): sky `#eef4fc`, azure
  `#2b5fc4` (every primary action), azure-deep `#1f4fa8`, ink `#1b2533`,
  ink-soft `#4b5768`, line `#c3d7f2`, ok `#1e6b47`.
- The phone screens in `src/components/phone/` are static ports of the demo.
  Each is drawn at 390 x 844 and scaled with the CSS variable `--s`.

## Scripts

- `scripts/fb-report.mjs`, `scripts/capi-backfill.mjs`: see above.
- `scripts/screenshot.mjs <url> <width> <height> <out.png> [y]` captures a page
  through headless Chrome's DevTools protocol (start Chrome with
  `--headless=new --remote-debugging-port=9333` first).
- `scripts/e2e-rules.mjs`: checks the signup rules against a running site with
  plain HTTP, no browser (counted, repeat, honeypot, test address, cross-segment,
  organic, old click, broken cookie, senior living fields). See the header for
  usage. Run it against a throwaway list, never real signups.
- `scripts/e2e-waitlist.mjs`: drives the forms in Chrome and checks what needs
  a browser: the cookie written from an ad URL, the senior living role swap, the
  "Not you?" links, and that `/` has no form and leaves the cookie alone.

## Structure

```
src/app/
  layout.tsx                 font, metadata, header/footer, MetaPixel, JSON-LD
  page.tsx                   "/" three-door chooser, no form
  families/, seniors/, senior-living/   page.tsx + opengraph-image.tsx each
  actions/waitlist.ts        server action: honeypot, validation, gating, Meta
  privacy/, terms/           legal pages
src/components/
  landing/                   VariantPage, Hero, Storyboard, Answers, Closing, WrongDoor
  phone/                     PhoneFrame, HelperFace, screens, lock screen
  waitlist-form.tsx          client form using useActionState
  attribution-capture.tsx    writes the fit_attr cookie
  meta-pixel.tsx             loads the Pixel when configured
src/config/site.ts           facts and placeholders
src/content/                 variants.ts (page copy), audiences.ts (segments, options)
src/lib/waitlist/            types, validation, attribution, providers
src/lib/meta/                Conversions API (server), browser event helper
scripts/                     report, backfill, screenshot, e2e
```
