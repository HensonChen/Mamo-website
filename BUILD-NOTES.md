# Build notes

# v1: new design, Tally sign-up (branch `landing-build-v1`)

Built on the local branch `landing-build-v1`, from `landing-build`. **Nothing
was pushed.** The sections below this one (from "Build notes: three segment
landing pages" on) describe the earlier `landing-build` branch; where they
mention the on-site form, the server action, `data/waitlist.ndjson` or
`e2e-rules.mjs`, they no longer apply here.

## What changed

- **Design** from `updated-landing-mockup`: pine/sage/plum palette, photo hero,
  three "why" points, "How it works" with an auto-playing phone demo, FAQ,
  closing band. One template (`VariantPage`) and one content file
  (`src/content/variants.ts`) are kept. Responsive: the mockup is desktop only;
  the layout stacks on phones (copy and button first, then the photo), the
  steps become a row of numbers under 1024px, and the two phones of the family
  demo shrink to fit 360px. No horizontal scroll from 320 to 1440px on any page.
- **Senior living steps** rewritten: "A resident asks out loud / It checks the
  email is real / It signs them in, with their OK / They tap Confirm. Done."
- **Sign-up** is a button to a Tally form, same tab. The on-site form, server
  action, validation, bot log and the two old e2e scripts were removed.
- **Tracking:** no event on click. `Lead` is sent when a form is really
  submitted: by the Pixel on `/thanks?sid=<submission id>` and by the signed
  webhook through the Conversions API, both with the submission id as event id.
  See the README, "How a signup works".

## Set up Tally (you do this; it was not done here)

For each of the three forms (families, seniors, community):

1. Add **hidden fields** named exactly as in `siteConfig.waitlist.tally.hiddenFields`:
   `segment`, `fbc`, `fbp`, `click_id`.
2. Add an **email** question (the webhook reads the first email-type field) and
   any other questions (name, community, who it is for). Questions live in
   Tally, not in this repo.
3. **Redirect on completion** to
   `https://<domain>/thanks?sid=@SubmissionID&seg=<segment>` (use the segment
   of that form). **Check that Tally accepts the submission-id mention in the
   redirect URL**; I could not open Tally from here. If Tally offers a different
   name for it, use that. If it cannot, `/thanks` simply fires no Pixel `Lead`
   and the webhook alone reports it (Meta still counts the signup).
4. **Webhook:** URL `https://<domain>/api/tally/webhook`, set a **signing
   secret**, and put the same value in `TALLY_SIGNING_SECRET`. Use Tally's
   "send test event" and confirm a 200.
5. Turn on **reCAPTCHA** (or Tally's spam protection) on the form. With no
   on-site form, that is the only bot protection.
6. Paste each form's URL into `src/config/site.ts` (the form id in the URL is
   how the webhook knows the segment).

The webhook checks the signature as base64 HMAC-SHA256 of the raw body in the
`tally-signature` header, which is what Tally documents. Confirm it with
Tally's test event; if it fails, `verifyTallySignature` in
`src/lib/tally-webhook.ts` is the one place to change.

## Decisions

- The webhook finds the segment from the form id, not the hidden field, because
  a visitor can edit URL parameters. The hidden `segment` is logged only for
  comparison.
- `click_id` (random UUID per button click) is hashed and sent as `external_id`
  so a signup can be matched without an email on the page.
- The webhook sends no IP address or user agent: the request is from Tally.
- Test addresses (`siteConfig.tracking.testEmails`, `+test`) are logged and
  never sent to Meta. Signups without an ad click in the last 7 days are
  logged, sent to Meta as `Lead`, and not counted in the cost per signup.
- `/thanks` shows the Pixel `Lead` only when `sid` looks like a real id
  (letters, digits, `-`, `_`, up to 64), and remembers it in `sessionStorage`.
- Phone screens keep the app's own blues; the page around them uses the new
  palette.
- The report can no longer tie a signup to one ad (the webhook has no ad id),
  so it counts signups per segment and lists ads with their spend only.
- The hero photos are copied from the mockup assets into `public/images`.
- The "How it works" demo is paused for visitors who prefer reduced motion, and
  has a pause button for everyone (WCAG 2.2.2).

## Verification

| Check | Status |
| --- | --- |
| `npm run lint`, `npx tsc --noEmit` | Passed |
| `npm run build` with Meta and Tally variables unset | Passed (fixed: route config is not allowed with Cache Components; `/thanks` reads `searchParams` inside `Suspense`) |
| `node scripts/e2e-tally.mjs` (signed webhook, dedupe, test address, unknown form, bad or missing signature, secret unset, `/thanks`, no form on pages) | Passed, 38 checks |
| Browser (Cursor): hero button gives Tally URL with `segment`, `fbc` (built from `fit_attr`), `fbp`, `click_id`, and sends no Pixel event | Passed, with a stand-in `fbq` and made-up cookies |
| Browser: `/thanks?sid=abc123` fires one `Lead` with `eventID` `abc123`; a reload fires none | Passed, with a stand-in `fbq` |
| Horizontal overflow at 320, 360, 390, 430, 600, 768, 900, 1024, 1280, 1440 on `/`, three segment pages, `/thanks`, `/privacy`, `/terms` | None (found and fixed overflow at 320 and 1024 on `/` and 320 on `/families`) |
| Contrast | Lowest text pair is faded step text on the pine hover (5.0); everything else 5.1 to 14.2 against the 4.5 minimum |
| Screenshots | Looked at in the Cursor browser at 390 and desktop width. No files saved |
| Real Tally forms, real submission, Tally signature on a real test event | **Not run** (forms do not exist yet) |
| Meta Events Manager: one `Lead` per submission from browser and server | **Not run** (needs your Pixel, token and a real submit) |
| Real phone, real ad click | **Not run** |
| `fb-report.mjs` against a real export | Syntax checked only; **not run** on data |

## Next

1. Create the three Tally forms and do the setup above.
2. Replace the placeholders in `src/config/site.ts`.
3. Set `TALLY_SIGNING_SECRET` and the Meta variables; run a test submission with
   `META_TEST_EVENT_CODE` and confirm one `Lead` with one event id.
4. Use a store that persists (`src/lib/signups/`) if the host has no writable disk.
5. Review the privacy text with whoever owns legal.

---

# Earlier build: three segment landing pages (`landing-build`)

Built overnight on the local branch `landing-build` (from `main`). **Nothing was
pushed.** `main` and `origin/main` are both still `8bc31e2`, `origin` is
unchanged, and `familyit-website` was not touched (its one uncommitted
`package-lock.json` change was already there).

## Push in the morning

```bash
git -C familyit-landing push -u origin landing-build
```

Then open a pull request into `main`. The `gh` login was invalid and ssh to
GitHub is unreachable from the build sandbox, so run `gh auth refresh -h github.com`
first if `gh` is needed.

## What was built

- `/families`, `/seniors`, `/senior-living`: one template (`VariantPage`), one
  content file (`src/content/variants.ts`), each with its own metadata, share
  image and JSON-LD. Price, trial and safety wording are written once in
  `src/config/site.ts` and referenced.
- `/` is a one-screen chooser: headline, one demo picture, three "Join the
  waitlist: ..." doors, no form, no attribution capture. Old `/solutions/*` URLs
  redirect.
- Phone screens in `src/components/phone/` are static ports of
  `WireframeDemoStyled2`, drawn at 390 x 844 and scaled with the CSS variable
  `--s`. The helper's eyes blink and look around, and stop for visitors who
  prefer reduced motion.
- Waitlist: per-segment fields, honeypot with bot log, duplicate check, test
  addresses, and the counting rules from the plan (see README). The senior
  living form refuses a submission without a community name, and choosing
  "I'm a resident or family member" swaps the button for the two consumer doors.
- Tracking: `fit_attr` cookie (segment pages only), Meta Pixel (when
  `NEXT_PUBLIC_META_PIXEL_ID` is set), server-side Conversions API with a shared
  event id, privacy page disclosure.
- Scripts: `fb-report.mjs` (readout), `capi-backfill.mjs`, `e2e-rules.mjs`,
  `e2e-waitlist.mjs`.

## Decisions where the plan was silent

- **Mobile order.** On a phone the hero shows headline, price, then the form,
  then the demo phones. The plan puts the phone beside the form; there is no
  "beside" at 390px, and the form needed to be on the first screen.
- **`whoFor` question** on the families form: "Who is it for?" with My parent,
  My grandparent, Someone else. Optional. It is the families form's quality
  signal in the report. The seniors form has no optional question.
- **Organic signups send `Lead`** (plan step 6 in the server action list), but
  are stored as not counted. The plan's text elsewhere says only a matched
  signup gets a `Lead` event id; the explicit server action order was followed.
  If you want organic signups to send nothing, change `eventName` in
  `src/app/actions/waitlist.ts` to be undefined when `paid` is false.
- **Attribution window.** The cookie lasts 30 days, but a signup counts for an ad
  only within 7 days of the click (`siteConfig.tracking.attributionWindowDays`),
  to match Ads Manager's 7-day click window. An older click is treated as
  organic.
- **Cookie is trusted only after checking.** Every field of `fit_attr` is
  validated on the server (length, characters, segment must be one of ours).
- **Header.** The logo is plain text, not a link, on the three segment pages, so
  paid visitors have no way to `/`. It is a link everywhere else.
- **Segment from the ad name.** The report reads the segment from the ad name's
  prefix (`families`, `seniors`, `senior-living`), because an ad with no
  signups has no other record of its segment. This is in the README checklist.
- **Graph API version** defaults to `v21.0` in `src/lib/meta/capi.ts` and the
  access token goes in the query string, as Meta documents. Check both against
  current docs.
- **Failed Conversions API events** are appended to `data/capi-failures.ndjson`.
  That works on a normal server; on a read-only host only the server log has them.
- Copy shows a few demo approximations: the sign-in page shows the demo's
  sample email address, the car-insurance example is used on every page, and the
  recap and notification dates are fixed text (Thursday, Nov 5, 9:47) so the
  pages prerender.

## Verification

| Check | Status |
| --- | --- |
| `npm run lint` | Passed, no warnings |
| `npm run build` | Passed with the Meta variables unset (site works without them) |
| Signup rules over HTTP (`scripts/e2e-rules.mjs`, 27 checks) | Passed on the final build |
| Cookie written from an ad URL; `/` leaves it unchanged; `/` has no form | Passed, checked by hand in the Cursor browser |
| Senior living role swap shows both consumer doors | Passed, checked by hand in the Cursor browser |
| No horizontal scroll at 390px on `/`, `/families`, `/seniors`, `/senior-living` | Passed. A real overflow (a grid item widened by the swipe row) was found and fixed first. `/privacy` and `/terms` were not measured |
| Contrast, all text pairs | Passed, 5.8 to 14.0 against the 4.5 minimum (the lowest is white on azure at 5.94, and ok on its tint at 5.77) |
| `fb-report.mjs` and `capi-backfill.mjs --dry-run` | Run on made-up data and worked. Not run against a real Ads Manager export |
| `scripts/e2e-waitlist.mjs` (Chrome script) | **Not run.** Chrome cannot start in the build sandbox. It was written but never executed, so expect to fix small things on its first run |
| Screenshots at 390 and 1440 | Partly. The Cursor browser tab is 1920 wide, so desktop was checked at 1920 (and phone width with an emulated 390). No files were saved to the repo |
| Side-by-side comparison with the demo at 390px | Eyeballed from screenshots, not pixel-compared |
| Meta Test Events, Pixel and server event with one id | **Not run** (needs a Pixel id, token and your Facebook account) |
| Real iPhone test through the Facebook app | **Not run** |
| Real Ads Manager export through the report | **Not run** |

## Morning checklist

1. Push the branch (command above) and open a pull request.
2. Create the Pixel and a Conversions API token. Set `NEXT_PUBLIC_META_PIXEL_ID`,
   `META_CAPI_ACCESS_TOKEN` and, only while testing, `META_TEST_EVENT_CODE`.
   Check Events Manager's Test Events: one event per signup, same event id from
   the browser and the server.
3. Real iPhone test: tap a test ad or open an ad URL inside the Facebook app and
   sign up. Confirm it traces to the ad in `data/waitlist.ndjson` (`device`
   `iphone`, `inApp` true).
4. Check Meta's current settings against the README checklist (domain
   verification, event priority, Graph API version, attribution setting).
5. Connect a production waitlist provider with `has(email)`. The file provider
   does not persist on serverless hosting.
6. Replace the placeholders in `src/config/site.ts` (domain, legal name, contact
   email, launch window, prices, team test addresses) and the privacy and terms
   placeholder notice.
7. Run `scripts/e2e-waitlist.mjs` once with Chrome (header of the file).
8. Look at each page on a real phone, and have someone over 65 try one.
