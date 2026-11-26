# Mamo waitlist site

Pre-launch site for Mamo (formerly FamilyIT), a voice-first AI tech helper for
older adults and the families who care about them. It has two audience landing
pages, built to test which audience signs up at the lowest cost on Facebook:

| Route | Nav label | Who it is for |
| --- | --- | --- |
| `/families` | For a loved one | Adult children: "Help your parents with tech, even when you're not there." |
| `/seniors` | For me | Older adults: "Get tech help whenever you need it, just by talking." |
| `/` | none | Home: "Ask Mamo, the tech helper for the whole family." Sends visitors to one of the two. Never an ad destination. |
| `/thanks` | none | Where Tally sends people after a real submit. Not indexed. |

`/senior-living` was retired with the Mamo redesign and redirects to `/`. Its
Tally form is still accepted by the webhook, so a late submission is logged.

Next.js (App Router), TypeScript, Tailwind CSS. Static pages plus one webhook
route. No CMS, auth or database. **There is no sign-up form on this site.**
Each "Join the waitlist" button opens a Tally form (tally.so, free plan) in the
same tab: the form of the page you are on, or the families form on pages with
no audience (home, privacy, terms). Tally collects the email and answers.

## Run it

Requires Node.js 20.9 or newer (Next.js 16's minimum) and npm.

```bash
git clone git@github.com:HensonChen/familyit-landing.git
cd familyit-landing   # the repository keeps its old name
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
| `SIGNUP_STORE` | Where the webhook logs signups: `file` (default, `data/signups.ndjson`) or `redis` (Upstash, for Vercel). |
| `SIGNUPS_FILE_NAME` | File name inside `data/` for the file store. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | With `SIGNUP_STORE=redis`: the Upstash REST URL and the read-write token. The Vercel Upstash connection provides both. The read-only token, `KV_URL` and `REDIS_URL` are not used. |

## Editing the site

| To change… | Edit |
| --- | --- |
| Facts: domain, contact email, launch window, prices, demo video, test addresses, Tally form URLs and hidden-field names, thank-you text | `src/config/site.ts` |
| Everything an audience page says (hero, persona story, benefits, features, comparison table, pricing blurbs, FAQ, closing) | `src/content/variants.ts` |
| Everything the home page says (hero, chat, persona cards, "Who is Mamo for?") | `src/content/home.ts` |
| The segment ids | `src/content/audiences.ts` |
| Pictures (photos, sketches, portraits) | `public/images/mamo/` |
| Page layout and styling, colors, fonts | `src/components/landing/`, `src/app/globals.css` |
| Privacy and terms text | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` |
| Questions asked at sign-up (name, anything else) | In Tally, not in this repo |

The two audience pages share one template (`VariantPage`) so that results
differ because of words and pictures, not layout. Price, trial and the demo
video are written once in `siteConfig` and referenced from the content file.

### Add the demo video

The "How Mamo works" section shows a "Demo video coming soon" card until a
video is set. To publish it:

1. Put the MP4 in `public/videos/` (for example `public/videos/mamo-demo.mp4`).
2. In `src/config/site.ts`, set `demoVideo.src` to `"/videos/mamo-demo.mp4"`.
3. Optional: a still image for `demoVideo.poster` (for example
   `/videos/mamo-demo-poster.jpg`), and a WebVTT captions file for
   `demoVideo.captions` (for example `/videos/mamo-demo.en.vtt`). Captions are
   worth adding for an audience that includes people who are hard of hearing.

The same video shows on both audience pages. Pressing play swaps in a native
player with controls; nothing is downloaded before then. Keep the file small
(a few MB, H.264) because Vercel serves it from the same host.

Old `/solutions/*` URLs redirect (see `next.config.ts`): seniors to
`/seniors`, and every other old page, including `/senior-living`, to `/`.

## How a signup works

```
ad  ->  /families (cookie fit_attr written from the ad URL)
    ->  any "Join the waitlist" button on the page (a plain link to the Tally form)
          on click, adds ?segment=families&fbc=...&fbp=...&click_id=...
    ->  Tally form (same tab)
    ->  submit
          Tally -> POST /api/tally/webhook   (signed; hashed email -> Meta CAPI "Lead")
          Tally -> redirect /thanks?sid=<submission id>&seg=<segment>
                   (page fires Pixel "Lead" with eventID = sid)
                   (same page embeds that segment's survey, with sid and seg filled in)
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
- **Follow-up survey.** Two Tally forms, embedded on `/thanks` only when
  `sid` is a real submission id. `seg=families` shows the families form and
  `seg=seniors` shows the seniors form (`siteConfig.waitlist.tally.survey.forms`).
  Any other segment shows no survey. Hidden fields `sid` and `seg` link the
  answers to the waitlist submission. Neither survey asks for an email, has a
  redirect, or points a webhook at `/api/tally/webhook`. Each ending is Tally's
  own thank-you screen. Join each survey export to the waitlist export on `sid`.
  Leaving the survey unfinished does not drop the signup or the Lead.

`AttributionCapture` writes `fit_attr` only on the two audience pages and only
when the URL has `fit_seg` plus `utm_medium=paid_social` or `fbclid`. The
cookie lasts 30 days, the last paid click wins, and visiting `/` never changes
it.

`data/signups.ndjson` is the local default. On Vercel the filesystem does not
persist, so set `SIGNUP_STORE=redis`: each record is stored as JSON under
`signup:<submissionId>` in Upstash Redis, and the ids are in the set
`signups:ids`. No email is stored. To read them for the report, load the same
variables (`vercel env pull .env.local`, then `set -a; source .env.local; set +a`)
and run `SIGNUP_STORE=redis node scripts/fb-report.mjs --ads ads.csv`.

## Facebook test: setup checklist

Paid ads send to the two audience pages only, never to `/`. Decision metric:
cost per real waitlist signup.

1. **Tally** (one form per audience page; see `BUILD-NOTES.md` for the full list):
   hidden fields, redirect, webhook, signing secret.
2. **Tally surveys** (the optional questions on `/thanks`): one form for
   families and one for seniors. Each has hidden fields named `sid` and `seg`,
   no email question, redirect left off, and Tally's own thank-you screen at
   the end. Do not point a webhook at `/api/tally/webhook`, and do not add
   either form id to `waitlist.tally.forms`. Paste each form's `/r/` URL into
   `siteConfig.waitlist.tally.survey.forms`. Join each export to the waitlist
   export on `sid`.
3. **Fill the placeholders** in `src/config/site.ts`: the Tally form URLs
   and the hidden-field names.
4. **Environment variables** from the table above.
5. **Team addresses** in `siteConfig.tracking.testEmails`.
6. **Privacy and terms**: replace the placeholder notice. The privacy page
   already says Tally collects the waitlist and that the email and ad-click id
   go to Meta on submit.
7. **Ad URLs.** Each ad's URL parameters:

   ```
   utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_term={{adset.id}}&utm_content={{ad.id}}&fit_seg=<segment>&fit_place={{placement}}
   ```

   `<segment>` is `families` or `seniors`, and the ad must open that
   audience's page.
8. **Name every ad with its segment first**, for example `families_concept1_a`,
   `seniors_concept1_a`. The report reads the
   segment from the name.
9. **Ads Manager**: 7-day click attribution, 1-day view off. Columns: Ad ID,
   Ad name, Amount spent, Impressions, Link clicks, Landing page views, Website
   leads. Export a CSV by ad id.
10. **Domain verification** in Business Manager. If Events Manager still shows
   Aggregated Event Measurement settings, put `Lead` first.
11. **Smoke test before spending**: with `META_TEST_EVENT_CODE` set, submit one
    form per audience page. Confirm each `Lead` appears in Test Events once, with one
    event id, from both the browser and the server.

### Reading the result

```bash
node scripts/fb-report.mjs --ads ads-export.csv \
  --since 2026-12-01 --until 2026-12-14
```

Add `--json` for machine-readable output. The report reads
`data/signups.ndjson` (or Redis, with `SIGNUP_STORE=redis`) and shows, per segment: spend, real signups (one per
Tally submission id), cost per signup with a 95% interval, Meta's leads and the
gap from ours (above about 20% means check tracking), and signups per landing
page view. A signup can no longer be tied to one ad, so ads are listed with
their spend and Meta leads and compared through their segment.

Decision rule (fixed before launch): the segment with the lowest cost per
signup wins if the runner-up costs at least 1.5 times more, or the 95% interval
on the cost ratio excludes 1. Otherwise it is a tie, broken by signup quality
(Tally's own export has the answers) and then strategy. Do not stop early. A
segment that stopped getting ads (such as the retired `senior-living`)
will show few signups because of the budget, not the audience.

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
and trial wording, the demo video, Tally URLs and field
names, and test addresses.

Also: the privacy and terms pages show a visible "Placeholder" notice from
`src/components/legal-page.tsx`. Remove it once the text is reviewed.

## Design (Mamo)

- Typeface: Figtree (400 to 800), loaded with `next/font/google`. Body text is
  18px on a phone and 20px on desktop; buttons are 48 to 60px tall, focus rings
  are thick.
- Palette (tokens in `src/app/globals.css`): sand `#edebe2` page, teal
  `#113c42` (headings, cards and bands), teal-soft `#2b4c51` (body text), sun
  `#eedc5b` (buttons on teal, icon tiles), blush `#e4b9ae` (accent), line
  `#d2d3cb`. Organic "pebble" shapes are the `blob-*` classes.
- Sections of an audience page: teal hero card with photo pebbles, persona
  story, three benefit sketches, "How Mamo works" video, six features,
  comparison table, launch pricing (Monthly/Annual switch), FAQ, closing band.
- The mockups were desktop only. Responsive rules: the hero shows five photo
  pebbles from 1024px, three from 768px and two on a phone; the header's links
  move under the logo row below 768px; the comparison table scrolls sideways
  with the row labels pinned; every other grid stacks. No horizontal scroll from
  320px up.
- The home page chat plays once as it scrolls into view and is shown in full
  for visitors who prefer reduced motion.

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
  page.tsx                   "/" home
  families/, seniors/        page.tsx + opengraph-image.tsx each
  thanks/                    where Tally redirects; fires the Pixel Lead, embeds the survey
  api/tally/webhook/route.ts signed webhook: dedupe, hash, Conversions API, log
  privacy/, terms/           legal pages
src/components/
  landing/                   VariantPage and its sections (Hero, Problem, Benefits, DemoVideo,
                             Features, Compare, Pricing, Questions, Closing); home sections
                             (ChatScene, Pain, Paths)
  sections/faq.tsx           the accordion
  header.tsx, footer.tsx     same on every page
  waitlist-button.tsx        the sign-up link; adds the hidden values on click
  lead-pixel.tsx             fires the Pixel Lead on /thanks
  survey-embed.tsx           the follow-up Tally survey on /thanks
  attribution-capture.tsx    writes the fit_attr cookie
  meta-pixel.tsx             loads the Pixel when configured
src/config/site.ts           facts and placeholders
src/content/                 variants.ts (audience pages), home.ts, audiences.ts (segment ids)
src/lib/                     attribution, tally, tally-webhook, signups/, meta/
public/images/mamo/          photos and sketches from the design
public/videos/               the demo video goes here
scripts/                     e2e-tally, report, backfill, screenshot
```
