# FamilyIT waitlist site

Pre-launch site for FamilyIT, a voice-and-screen AI tech helper for older
adults. It has three landing pages, one per go-to-market segment, built to test
which segment signs up at the lowest cost on Facebook:

| Route | Segment | Who it is for |
| --- | --- | --- |
| `/families` | Adult children | "Be their family, not their help desk." |
| `/seniors` | Older adults | "Tech help whenever you need it. Just talk." |
| `/senior-living` | Senior living operators | "Your staff are trained for care, not Wi-Fi passwords." |
| `/` | none | A one-screen chooser with three doors. Never an ad destination. |
| `/thanks` | none | Where Tally sends people after a real submit. Not indexed. |

Next.js (App Router), TypeScript, Tailwind CSS. Static pages plus one webhook
route. No CMS, auth or database. **There is no sign-up form on this site.**
Each segment page has a button that opens a Tally form (tally.so, free plan)
in the same tab. Tally collects the email and answers.

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

No environment variables are needed to look at the site locally. `.env*` files
are gitignored; put keys in `.env.local`.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Loads the Meta Pixel. Unset: no Pixel. |
| `META_CAPI_ACCESS_TOKEN` | Server-only. Conversions API token. Unset: no server events. |
| `META_TEST_EVENT_CODE` | Only while checking Events Manager's Test Events tab. |
| `META_GRAPH_VERSION` | Optional. Defaults to the version in `src/lib/meta/capi.ts`. |
| `META_CAPI_DRY_RUN=1` | Writes each Conversions API payload to `data/capi-dry-run.ndjson` instead of sending it. For tests. |
| `TALLY_SIGNING_SECRET` | Server-only. The signing secret from the Tally webhook. Unset: the webhook answers 503 and does nothing. |
| `SIGNUP_STORE` | Where the webhook logs signups. Default `file` (`data/signups.ndjson`). |
| `SIGNUPS_FILE_NAME` | File name inside `data/` for the file store. |

## Editing the site

| To change… | Edit |
| --- | --- |
| Facts: domain, contact email, launch window, prices, test addresses, Tally form URLs and hidden-field names, thank-you text | `src/config/site.ts` |
| Everything a segment page says (hero, why points, steps, phone captions, FAQ, closing) | `src/content/variants.ts` |
| The segment ids | `src/content/audiences.ts` |
| The phone pictures | `src/components/phone/` |
| Page layout and styling | `src/components/landing/`, `src/app/globals.css` |
| Privacy and terms text | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` |
| Questions asked at sign-up (name, community, anything else) | In Tally, not in this repo |

The three pages share one template (`VariantPage`) so that results differ
because of words and pictures, not layout. Price, trial and safety wording are
written once in `siteConfig.product` and referenced from the content file.

Old `/solutions/*` URLs redirect (see `next.config.ts`): seniors to
`/seniors`, care centers to `/senior-living`, the two removed audiences to `/`.

## How a signup works

```
ad  ->  /families (cookie fit_attr written from the ad URL)
    ->  "Join the waitlist" button (a plain link to the Tally form)
          on click, adds ?segment=families&fbc=...&fbp=...&click_id=...
    ->  Tally form (same tab)
    ->  submit
          Tally -> POST /api/tally/webhook   (signed; hashed email -> Meta CAPI "Lead")
          Tally -> redirect /thanks?sid=<submission id>&seg=<segment>
                   (page fires Pixel "Lead" with eventID = sid)
```

- **Nothing counts on click.** No Meta event is sent when the button is
  pressed. A signup is a submitted Tally form, nothing else.
- **No JavaScript:** the link still works and carries `segment`. The Meta
  values need JavaScript.
- **Hidden fields** `segment`, `fbc`, `fbp`, `click_id`: the names are in
  `siteConfig.waitlist.tally.hiddenFields`. `fbc` is the `_fbc` cookie, or
  built from the `fbclid` in `fit_attr`. `click_id` is a random UUID made per
  click.
- **Dedupe:** the thank-you page and the webhook both send a `Lead`, both with
  Tally's submission id as the event id. Meta counts it once. The page
  remembers the id in `sessionStorage`, so a reload sends nothing.
- **The webhook is the source of truth.** It checks Tally's signature
  (HMAC-SHA256 of the raw body, base64, header `tally-signature`) and finds the
  segment from the form id, not from the hidden field. It ignores repeated
  submission ids, hashes the email, and logs a line without the email to
  `data/signups.ndjson`. The email stays in Tally.
- **Counted for the report:** the ad click inside 7 days (read from `fbc`) and
  not a test address (team addresses in `siteConfig.tracking.testEmails`, or any
  address with `+test`). Test submissions are logged and never sent to Meta.
- The server sends no IP address or user agent: the webhook request comes from
  Tally's server, not the visitor.

`AttributionCapture` writes `fit_attr` only on the three segment pages and only
when the URL has `fit_seg` plus `utm_medium=paid_social` or `fbclid`. The
cookie lasts 30 days, the last paid click wins, and visiting `/` never changes
it.

`data/signups.ndjson` is a development default. On serverless hosting the
filesystem does not persist; add a store in `src/lib/signups/` (the interface
has two methods, `has` and `add`) and choose it with `SIGNUP_STORE`.

## Facebook test: setup checklist

Paid ads send to the three segment pages only, never to `/`. Decision metric:
cost per real waitlist signup.

1. **Tally** (one form per segment; see `BUILD-NOTES.md` for the full list):
   hidden fields, redirect, webhook, signing secret.
2. **Fill the placeholders** in `src/config/site.ts`: the three Tally form URLs
   and the hidden-field names.
3. **Environment variables** from the table above.
4. **Team addresses** in `siteConfig.tracking.testEmails`.
5. **Privacy and terms**: replace the placeholder notice. The privacy page
   already says Tally collects the waitlist and that the email and ad-click id
   go to Meta on submit.
6. **Ad URLs.** Each ad's URL parameters:

   ```
   utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_term={{adset.id}}&utm_content={{ad.id}}&fit_seg=<segment>&fit_place={{placement}}
   ```

   `<segment>` is `families`, `seniors` or `senior-living`, and the ad must
   open that segment's page.
7. **Name every ad with its segment first**, for example `families_concept1_a`,
   `seniors_concept1_a`, `senior-living_concept1_a`. The report reads the
   segment from the name.
8. **Ads Manager**: 7-day click attribution, 1-day view off. Columns: Ad ID,
   Ad name, Amount spent, Impressions, Link clicks, Landing page views, Website
   leads. Export a CSV by ad id.
9. **Domain verification** in Business Manager. If Events Manager still shows
   Aggregated Event Measurement settings, put `Lead` first.
10. **Smoke test before spending**: with `META_TEST_EVENT_CODE` set, submit one
    form per page. Confirm each `Lead` appears in Test Events once, with one
    event id, from both the browser and the server.

### Reading the result

```bash
node scripts/fb-report.mjs --ads ads-export.csv \
  --since 2026-12-01 --until 2026-12-14
```

Add `--json` for machine-readable output. The report reads
`data/signups.ndjson` and shows, per segment: spend, real signups (one per
Tally submission id), cost per signup with a 95% interval, Meta's leads and the
gap from ours (above about 20% means check tracking), and signups per landing
page view. A signup can no longer be tied to one ad, so ads are listed with
their spend and Meta leads and compared through their segment.

Decision rule (fixed before launch): the segment with the lowest cost per
signup wins if the runner-up costs at least 1.5 times more, or the 95% interval
on the cost ratio excludes 1. Otherwise it is a tie, broken by signup quality
(Tally's own export has the answers) and then strategy. Do not stop early. A
weak `/senior-living` result can be a channel result, since Facebook's reach
among operators is thin.

If a Conversions API call failed, the event is kept in
`data/capi-failures.ndjson`. Resend while Meta still accepts it (7 days):

```bash
set -a; source .env.local; set +a
node scripts/capi-backfill.mjs --dry-run   # look first
node scripts/capi-backfill.mjs
```

## Before launch: placeholders

Everything factual lives in **`src/config/site.ts`**; search for `PLACEHOLDER`:
the domain, legal name, contact email, socials, launch window, regions, prices
and trial wording, community pricing and pilot notes, Tally URLs and field
names, and test addresses.

Also: the privacy and terms pages show a visible "Placeholder" notice from
`src/components/legal-page.tsx`. Remove it once the text is reviewed.

## Design (v1)

- Typeface: Atkinson Hyperlegible, designed by the Braille Institute for
  low-vision readers. Body text is 18px, buttons are 64px tall, focus rings are
  thick.
- Palette: paper `#fbfaf7`, sage `#e6ede6`, pine `#244b43` (headings and dark
  bands), plum `#7c3c5c` (every primary action), ink `#1e2a28`, ink-soft
  `#4c5a57`. Tokens are in `src/app/globals.css`.
- Sections of a segment page: photo hero with the sign-up button, "why" points,
  "How it works" with a phone demo, FAQ, closing band.
- "How it works" plays by itself once it scrolls into view and loops. It has a
  pause button and step buttons. For visitors who prefer reduced motion it does
  not start by itself.
- The phone screens in `src/components/phone/` are drawn at 390 x 844 and
  scaled with the CSS variable `--s`; they keep the app's own blues. They
  shrink to fit a 360px screen (two phones side by side on family pages).

## Scripts

- `scripts/e2e-tally.mjs`: after `npm run build`, starts the site with
  `TALLY_SIGNING_SECRET=test` and `META_CAPI_DRY_RUN=1`, then checks the pages
  have no form and a Tally button, and sends signed sample submissions to the
  webhook (counted, repeat, bad signature, secret unset, test address, unknown
  form) and `/thanks`. Nothing leaves the machine.
- `scripts/fb-report.mjs`, `scripts/capi-backfill.mjs`: see above.
- `scripts/screenshot.mjs <url> <width> <height> <out.png> [y]` captures a page
  through headless Chrome's DevTools protocol (start Chrome with
  `--headless=new --remote-debugging-port=9333` first).

## Structure

```
src/app/
  layout.tsx                 font, metadata, header/footer, MetaPixel, JSON-LD
  page.tsx                   "/" three-door chooser
  families/, seniors/, senior-living/   page.tsx + opengraph-image.tsx each
  thanks/                    where Tally redirects; fires the Pixel Lead
  api/tally/webhook/route.ts signed webhook: dedupe, hash, Conversions API, log
  privacy/, terms/           legal pages
src/components/
  landing/                   VariantPage, Hero, Why, HowItWorks, Questions, Closing, WrongDoor
  phone/                     PhoneFrame, HelperFace, screens, lock screen, typed text
  waitlist-button.tsx        the sign-up link; adds the hidden values on click
  lead-pixel.tsx             fires the Pixel Lead on /thanks
  attribution-capture.tsx    writes the fit_attr cookie
  meta-pixel.tsx             loads the Pixel when configured
src/config/site.ts           facts and placeholders
src/content/                 variants.ts (page copy), audiences.ts (segment ids)
src/lib/                     attribution, tally, tally-webhook, signups/, meta/
scripts/                     e2e-tally, report, backfill, screenshot
```
