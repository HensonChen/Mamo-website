/**
 * Single source of truth for every real-world fact on the site.
 *
 * Anything marked `// PLACEHOLDER` must be replaced before launch. Search this
 * file for "PLACEHOLDER" to find them all. Page copy lives in
 * `src/content/variants.ts`; product facts that may change (price, trial,
 * languages, safety promises) live here under `product` so they can be edited
 * in one place.
 */

export const siteConfig = {
  name: "FamilyIT",
  legalName: "FamilyIT", // PLACEHOLDER: registered legal entity name
  tagline: "Tech help older adults can just talk to",
  description:
    "FamilyIT is an on-demand tech helper for older adults. They talk to it, show it their screen, and get step-by-step help, while family sets the language, the limits, and the level of help. Join the waitlist.",

  /** Canonical origin, no trailing slash. Used for metadataBase, sitemap, JSON-LD. */
  url: "https://www.familyit.example.com", // PLACEHOLDER: real production domain

  /** Shown in the footer and used for mailto links. */
  contactEmail: "hello@familyit.example.com", // PLACEHOLDER: real contact email

  /** Social profiles for JSON-LD sameAs. Empty array is fine. */
  socials: [] as string[], // PLACEHOLDER: e.g. "https://www.linkedin.com/company/familyit"

  /** Twitter / X handle for Twitter card metadata, or null. */
  twitterHandle: null as string | null, // PLACEHOLDER: e.g. "@familyit"

  /** Year the company started, shown in the footer copyright. */
  foundingYear: "2026", // PLACEHOLDER

  /**
   * Product facts. Everything here is written as what FamilyIT does, not as
   * what is available today, because this is a pre-launch waitlist.
   */
  product: {
    /** Where we are in the launch. Shown near the waitlist form. */
    launchWindow: "Early access opens in 2027", // PLACEHOLDER
    /** Regions where the first wave will be available. */
    initialRegions: "the United States", // PLACEHOLDER

    /** Consumer pricing, from the press release. Shown on /families and /seniors only. */
    consumerPrice: "$25 a month", // PLACEHOLDER until pricing is final
    trialNote: "first month free", // PLACEHOLDER
    priceCompare: "Less than one tech-support visit.",
    chargeReminder: "Join the waitlist for no charge and early access.",
    // chargeReminder: "We'll remind you before your first charge.",

    /** Community pricing: no number on purpose. Shown on /senior-living only. */
    communityPricingNote:
      "Priced per resident, with community rates.", // PLACEHOLDER
    /** Length of the pilot is decided later, so no number is promised here. */
    pilotNote: "Founding communities get a free pilot.", // PLACEHOLDER

    languagesNote: "50+ languages",
    setupNote: "about 10 minutes to set up",
    devicesNote: "Phone, Mac and Windows",

    /**
     * Safety promises, shared so the three pages stay consistent. Each one
     * needs a matching product decision before launch. Do not add labels that
     * cannot be verified, such as "bank-level security".
     */
    safety: {
      question: "Is it safe?",
      questionCommunity: "Is it safe for residents?",
      families:
        "Saved passwords are encrypted and never shown on screen. FamilyIT asks your parent before any important step, like signing in, paying, or sending a form. You're told right away whenever it uses a saved password or changes a security setting.",
      seniors:
        "Yes. Your passwords are locked away and never shown on screen. FamilyIT checks that messages are real, and always asks you before anything important, like signing in or paying.",
      seniorLiving:
        "Resident logins are encrypted and never shown on screen, and your staff never handle resident passwords. FamilyIT asks the resident before any important step, and family members can be told whenever a saved password is used.",
    },
  },

  /**
   * The waitlist lives in Tally (tally.so), one form per segment. This repo
   * holds only the button, the thank-you page and the webhook receiver. Tally
   * holds the questions, the hidden fields, the redirect after submit, the
   * webhook URL and the signing secret (TALLY_SIGNING_SECRET, server only).
   */
  waitlist: {
    tally: {
      /** One form per segment. The form id in the URL (`/r/<id>`) tells the webhook which segment it is. */
      forms: {
        families: { url: "https://tally.so/r/PLACEHOLDER_FAMILIES" }, // PLACEHOLDER
        seniors: { url: "https://tally.so/r/PLACEHOLDER_SENIORS" }, // PLACEHOLDER
        "senior-living": { url: "https://tally.so/r/PLACEHOLDER_COMMUNITY" }, // PLACEHOLDER
      },
      /** Hidden-field names. They must match the names created in each Tally form. */
      hiddenFields: {
        segment: "segment", // PLACEHOLDER
        fbc: "fbc", // PLACEHOLDER
        fbp: "fbp", // PLACEHOLDER
        clickId: "click_id", // PLACEHOLDER
      },
    },
    /** Where Tally sends people after a real submit. Set as the form's redirect: /thanks?sid=@SubmissionID&seg=@segment */
    thanksPath: "/thanks",
    /** Shown near the button, so nobody is surprised to leave the site. */
    buttonNote: "Opens a short sign-up form on tally.so",
    /** Shown under the form buttons. */
    privacyNote:
      "We only use your email to tell you about FamilyIT. No spam, and you can leave the list with one click.",
    /** Confirmation copy on the thank-you page. */
    successTitle: "You're on the list.",
    successBody: "We'll email you when early access opens.",
  },

  /** Paid-traffic measurement. See the README section on the Facebook test. */
  tracking: {
    /** Signups from these addresses are stored but never counted or sent to Meta. */
    testEmails: ["test@familyit.example.com"] as string[], // PLACEHOLDER: add team addresses
    /** A signup counts for a paid ad only within this many days of the ad click. */
    attributionWindowDays: 7,
  },

  /** Last meaningful content update, used for sitemap lastModified. */
  lastModified: "2026-11-15",
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute URL helper built on the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

export const mailHref = `mailto:${siteConfig.contactEmail}`;
