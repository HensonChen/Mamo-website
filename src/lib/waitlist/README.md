# Waitlist storage

Signups flow: `WaitlistForm` (client component, `useActionState`) →
`joinWaitlist` server action (`src/app/actions/waitlist.ts`) →
`validateWaitlist` → `getWaitlistProvider()`.

The server action:

- logs and fake-succeeds when the hidden honeypot field `website` is filled,
- validates every field on the server (email always; the community name for
  `/senior-living`; the other fields are optional and checked against fixed
  lists),
- checks for a duplicate with `provider.has(email)`,
- reads the `fit_attr` cookie (`attribution.ts`) to decide whether the signup is
  paid, cross-segment or organic, and whether it counts,
- stores the entry with `provider.add(entry)`,
- sends the signup to Meta's Conversions API (`src/lib/meta/capi.ts`),
- returns field errors or a success state, with the event name and id for the
  browser Pixel.

The order and the counting rules are in the main README.

## Default provider: local file

`WAITLIST_PROVIDER=file` (the default) appends NDJSON to `data/waitlist.ndjson`
(or `data/$WAITLIST_FILE_NAME`) and honeypot hits to `data/bot-hits.ndjson`. The
`data/` directory is gitignored. This is for local development only: serverless
filesystems are ephemeral.

## Adding a real provider

1. Create `src/lib/waitlist/providers/<name>.ts` exporting a function that
   returns a `WaitlistProvider`: `{ name, add(entry), has(email), logBot(hit) }`.
2. Register it in the `switch` in `src/lib/waitlist/index.ts`.
3. Set `WAITLIST_PROVIDER=<name>` and any API keys in `.env.local` / your host.

All three methods are required. `has` must be exact on the lowercased email,
because duplicate signups are never reported to Meta. Throw on failure; the
action turns it into a friendly error and logs the cause on the server. The
report script (`scripts/fb-report.mjs`) reads `data/waitlist.ndjson`, so export
a production list in the same line format to use it.
