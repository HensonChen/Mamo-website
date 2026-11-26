/**
 * Single source of truth for every real-world fact on the site.
 *
 * Anything marked `// PLACEHOLDER` must be replaced before launch. Search this
 * file for "PLACEHOLDER" to find them all. Page copy lives in
 * `src/content/variants.ts` and `src/content/home.ts`; product facts that may
 * change (price, trial, launch window) live here under `product` so they can
 * be edited in one place.
 */

export const siteConfig = {
  name: "Mamo",
  legalName: "Mamo", // PLACEHOLDER: registered legal entity name
  tagline: "The tech helper for the whole family",
  description:
    "Mamo is a voice-first tech helper for older adults and the families who care about them. Ask out loud and get it done, with everyone in the loop. Join the waitlist.",

  /** Canonical origin, no trailing slash. Used for metadataBase, sitemap, JSON-LD. */
  url: "https://heymamo.vercel.app",

  /** Shown in the footer and used for mailto links. */
  contactEmail: "familyitapp@gmail.com", // PLACEHOLDER: keep until a Mamo address exists

  /** Social profiles for JSON-LD sameAs. Empty array is fine. */
  socials: [] as string[], // PLACEHOLDER: e.g. "https://www.linkedin.com/company/mamo"

  /** Twitter / X handle for Twitter card metadata, or null. */
  twitterHandle: null as string | null, // PLACEHOLDER: e.g. "@heymamo"

  /** Year the company started, shown in the footer copyright. */
  foundingYear: "2026", // PLACEHOLDER

  /**
   * Product facts. Everything here is written as what Mamo does, not as
   * what is available today, because this is a pre-launch waitlist.
   */
  product: {
    /** Where we are in the launch. */
    launchWindow: "Launching early 2027",
    /** Shown under the hero button. */
    heroNote: "No charge today \u00b7 Launching early 2027",
    /** Regions where the first wave will be available. */
    initialRegions: "the United States", // PLACEHOLDER

    trialNote: "30-day free trial at launch",
    chargeNote: "You won\u2019t be charged now \u00b7 Prices in USD",
    /** The lowest monthly price, quoted in comparison tables and on the home page. */
    fromPrice: "$19.99",

    /** Launch pricing. Annual is two months free. */
    plans: {
      family: {
        name: "Family",
        monthly: "$19.99",
        yearly: "$199.99",
        monthlyNote: "or $199.99/year (2 months free)",
        yearlyNote: "About $16.67/mo, billed yearly \u2014 2 months free",
      },
      familyPlus: {
        name: "Family Plus",
        monthly: "$29.99",
        yearly: "$299.99",
        monthlyNote: "or $299.99/year (2 months free)",
        yearlyNote: "About $25.00/mo, billed yearly \u2014 2 months free",
      },
    },
  },

  /**
   * The demo video under "How Mamo works" on both audience pages. While `src`
   * is null the page shows a "coming soon" placeholder. To publish it, put the
   * MP4 in `public/videos/` and set `src: "/videos/mamo-demo.mp4"`. `poster`
   * (a still image, e.g. "/videos/mamo-demo-poster.jpg") and `captions` (a
   * WebVTT file, e.g. "/videos/mamo-demo.en.vtt") are optional.
   */
  demoVideo: {
    src: "/videos/mamo-demo.mp4", // PLACEHOLDER: "/videos/mamo-demo.mp4"
    poster: "/images/mamo/mamo-poster-landscape.png",
    captions: "/videos/mamo-demo.en.vtt",
  },

  /**
   * The waitlist lives in Tally (tally.so), one form per segment. This repo
   * holds only the button, the thank-you page and the webhook receiver. Tally
   * holds the questions, the hidden fields, the redirect after submit, the
   * webhook URL and the signing secret (TALLY_SIGNING_SECRET, server only).
   *
   * The follow-up surveys are separate Tally forms, one for families and one
   * for seniors, embedded on the thank-you page. They are not listed in
   * `forms`, so a survey submission is not a Lead.
   */
  waitlist: {
    tally: {
      /**
       * One form per segment. The form id in the URL (`/r/<id>`) tells the
       * webhook which segment it is. `senior-living` has no page any more; its
       * form stays here so a stray submission is still logged.
       */
      forms: {
        families: { url: "https://tally.so/r/xVDR0d" }, // For a loved one (families)
        seniors: { url: "https://tally.so/r/J1l8EK" }, // For me (seniors)
        "senior-living": { url: "https://tally.so/r/BEpjLe" }, // Retired page, webhook only
      },
      /** Hidden-field names. They must match the names created in each Tally form. */
      hiddenFields: {
        segment: "segment",
        fbc: "fbc",
        fbp: "fbp",
        clickId: "click_id",
      },
      /**
       * Follow-up surveys embedded on /thanks after a real waitlist submit.
       * `seg=families` shows the families form and `seg=seniors` shows the
       * seniors form. Leave a url empty until that form exists: an empty or
       * non-Tally value renders no iframe. These ids must stay out of `forms`.
       * Hidden-field names must match each survey and the thank-you query string.
       */
      survey: {
        forms: {
          families: { url: "https://tally.so/embed/M1RRA0?hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1" }, // For a loved one
          seniors: { url: "https://tally.so/embed/X500k4?hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1" }, // For me
        },
        hiddenFields: {
          submissionId: "sid",
          segment: "seg",
        },
        /** Shown on /thanks only when that segment's survey iframe is shown. */
        prompt: "A few quick questions help us build the right Mamo. Everyone who answers gets founding-member pricing.",
      },
    },
    /** Where Tally sends people after a real submit. Set as the form's redirect: /thanks?sid=@SubmissionID&seg=@segment */
    thanksPath: "/thanks",
    /** Shown under the form buttons. */
    privacyNote:
      "We only use your email to tell you about Mamo. No spam, and you can leave the list with one click.",
    /** Confirmation copy on the thank-you page. */
    successTitle: "You're on the list.",
    successBody: "We'll email you when early access opens.",
  },

  /** Paid-traffic measurement. See the README section on the Facebook test. */
  tracking: {
    /** Signups from these addresses are stored but never counted or sent to Meta. */
    testEmails: ["familyitapp@gmail.com"] as string[], // team email addresses
    /** A signup counts for a paid ad only within this many days of the ad click. */
    attributionWindowDays: 7,
  },

  /** Last meaningful content update, used for sitemap lastModified. */
  lastModified: "2026-11-26",
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute URL helper built on the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

export const mailHref = `mailto:${siteConfig.contactEmail}`;
