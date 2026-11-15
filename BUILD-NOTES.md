# Build notes: three segment landing pages

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
