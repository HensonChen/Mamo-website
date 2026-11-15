/**
 * Copy and settings for the three segment landing pages. Everything a page
 * says lives here as plain data, so the layout components stay generic.
 *
 * Price, trial, community pricing and safety wording come from
 * `siteConfig.product`; they are referenced here, never retyped.
 */

import { siteConfig } from "@/config/site";
import type { SegmentId } from "@/content/audiences";

const { product } = siteConfig;

/** Which demo screen to draw. Each maps to a component in src/components/phone. */
export type ScreenId =
  | "home"
  | "listening"
  | "email"
  | "signin"
  | "explain"
  | "notice-done"
  | "notice-login"
  | "recap";

export type IconKey = "help" | "sliders" | "lock" | "mic" | "clock" | "building" | "people" | "card";

export type AnswerTile = {
  icon: IconKey;
  question: string;
  answer: string;
  /** Marks the safety tile so it is always drawn the same way. */
  safety?: boolean;
  /** Draws the "autonomy dial" under the answer. */
  dial?: boolean;
  /** Which demo notification to show under the answer, if any. */
  screen?: ScreenId;
};

export type StoryboardStep = { screen: ScreenId; caption: string };

/** One piece of the "Not you?" line: plain text, or a link to another page. */
export type DoorPart = { text: string; href?: string };

export type FormFieldKey = "email" | "whoFor" | "organization" | "residents" | "role" | "offerModel";

export type Variant = {
  id: SegmentId;
  /** Route, no trailing slash. */
  path: string;
  /** Short label used in structured data and OG images. */
  label: string;
  meta: { title: string; description: string };
  hero: {
    headline: string;
    lede: string;
    /** Submit button text. */
    cta: string;
    /** Price or pricing lines shown next to the button. */
    priceLines: string[];
    /** Which demo screens sit beside the form. */
    screens: ScreenId[];
    /** Extra tiles shown beside the phone on /senior-living. */
    outcomes?: string[];
  };
  /** Wording for the helper screens, so they fit who is looking at the page. */
  screenCopy: {
    homeIntro: string;
    signInMessage: string;
    recapWho: string;
    recapAction: string;
    noticeDoneTitle: string;
    noticeDoneBody: string;
    noticeLoginTitle: string;
    noticeLoginBody: string;
  };
  storyboard: { heading: string; steps: StoryboardStep[] };
  answers: AnswerTile[];
  faqs: { question: string; answer: string }[];
  form: {
    heading: string;
    closingHeading: string;
    emailLabel: string;
    /** Fields drawn in the hero form and in the closing form. */
    heroFields: FormFieldKey[];
    closingFields: FormFieldKey[];
    note: string;
  };
  doorLine: DoorPart[];
};

const consumerPriceLines = [
  `${product.consumerPrice}, ${product.trialNote}. ${product.priceCompare}`,
  product.chargeReminder,
];

export const variants: Record<SegmentId, Variant> = {
  families: {
    id: "families",
    path: "/families",
    label: "For my parent",
    meta: {
      title: "Be their family, not their help desk",
      description:
        "FamilyIT helps your parent with passwords, portals, and bills, day or night. You set the language and the limits, and get a short note when it's done. Join the waitlist.",
    },
    hero: {
      headline: "Be their family, not their help desk.",
      lede: "FamilyIT helps your parent with passwords, portals, and bills, day or night. You get a short note when it's done.",
      cta: "Join the waitlist",
      priceLines: consumerPriceLines,
      screens: ["explain", "notice-done"],
    },
    screenCopy: {
      homeIntro: "Henson set me up for you.",
      signInMessage: "Signing you in with the login Henson saved.",
      recapWho: "Mom",
      recapAction: "Call Mom",
      noticeDoneTitle: "Mom confirmed her updated car insurance policy.",
      noticeDoneBody: "No action needed from you.",
      noticeLoginTitle: "Mom used the insurance login you saved.",
      noticeLoginBody: "With her OK, she's now signed in to Evergreen.",
    },
    storyboard: {
      heading: "See it help",
      steps: [
        { screen: "listening", caption: "Mom asks out loud" },
        { screen: "email", caption: "It checks the email is real" },
        { screen: "signin", caption: "It signs her in, with her OK" },
        { screen: "recap", caption: "You get a summary" },
      ],
    },
    answers: [
      {
        icon: "help",
        question: "What does it help with?",
        answer: "Logins, patient portals, bills, and renewal notices. Your parent just talks, and FamilyIT shows each step.",
      },
      {
        icon: "sliders",
        question: "How do I stay in control?",
        answer:
          "You choose the language, the websites it may open, and how much it does alone: from \u201CMom decides, I'm told\u201D to \u201CI approve first.\u201D",
        dial: true,
      },
      {
        icon: "lock",
        question: product.safety.question,
        answer: product.safety.families,
        safety: true,
        screen: "notice-login",
      },
    ],
    faqs: [
      {
        question: "Will I see everything my parent does?",
        answer:
          "You see a summary of what FamilyIT helped with. Your parent is told what is shared, and setup starts with a conversation about it.",
      },
      {
        question: "What if it makes a mistake?",
        answer:
          "FamilyIT guides and explains. For sensitive steps like payments or forms, it asks your parent to confirm, and can ask you to approve, depending on the level you choose.",
      },
      {
        question: "Which languages does it speak?",
        answer: `${product.languagesNote}. You pick your parent's language when you set it up.`,
      },
    ],
    form: {
      heading: "Join the waitlist",
      closingHeading: "Get your evenings back",
      emailLabel: "Your email",
      heroFields: ["email", "whoFor"],
      closingFields: ["email", "whoFor"],
      note: "Joining is free. No card needed.",
    },
    doorLine: [
      { text: "Looking for help for yourself? " },
      { text: "For me", href: "/seniors" },
      { text: ". Run a senior living community? " },
      { text: "For my community", href: "/senior-living" },
      { text: "." },
    ],
  },

  seniors: {
    id: "seniors",
    path: "/seniors",
    label: "For me",
    meta: {
      title: "Tech help whenever you need it. Just talk.",
      description:
        "Tap one button and say what's wrong. FamilyIT shows you each step with passwords, bills, and appointments, so you don't have to keep asking others. Join the waitlist.",
    },
    hero: {
      headline: "Tech help whenever you need it. Just talk.",
      lede: "Tap one button and say what's wrong. FamilyIT shows you each step.",
      cta: "Join the waitlist",
      priceLines: consumerPriceLines,
      screens: ["home"],
    },
    screenCopy: {
      homeIntro: "I'm FamilyIT, your tech helper.",
      signInMessage: "Signing you in with your saved login.",
      recapWho: "You",
      recapAction: "Done",
      noticeDoneTitle: "You confirmed your updated car insurance policy.",
      noticeDoneBody: "All done.",
      noticeLoginTitle: "FamilyIT signed you in.",
      noticeLoginBody: "With your OK.",
    },
    storyboard: {
      heading: "See it help",
      steps: [
        { screen: "listening", caption: "I ask out loud" },
        { screen: "email", caption: "It checks my email is real" },
        { screen: "signin", caption: "It signs me in, with my OK" },
        { screen: "explain", caption: "I tap Confirm. Done." },
      ],
    },
    answers: [
      {
        icon: "mic",
        question: "Do I have to type?",
        answer: "No. Just talk, and FamilyIT answers in plain words.",
      },
      {
        icon: "clock",
        question: "Will I have to keep asking my kids?",
        answer: "No. FamilyIT is there day and night, and it never gets tired of the same question.",
      },
      {
        icon: "lock",
        question: product.safety.question,
        answer: product.safety.seniors,
        safety: true,
      },
    ],
    faqs: [
      {
        question: "Can it see everything on my screen?",
        answer:
          "It sees only what you choose to share, while you are in a session. Your family can block websites, so it cannot open banking or other pages they have ruled out.",
      },
      {
        question: "Will my family see everything I do?",
        answer:
          "Your family sees a summary of what FamilyIT helped with, and you are told what is shared. Setup starts with a conversation about it.",
      },
      {
        question: "How is it different from a chatbot?",
        answer:
          "A chatbot tells you what to do. FamilyIT talks with you, sees your screen, and guides you through each step as it happens.",
      },
    ],
    form: {
      heading: "Join the waitlist",
      closingHeading: "Ready when you are",
      emailLabel: "Your email",
      heroFields: ["email"],
      closingFields: ["email"],
      note: "Joining is free. No card needed.",
    },
    doorLine: [
      { text: "Signing up for a parent? " },
      { text: "For my parent", href: "/families" },
      { text: ". Run a senior living community? " },
      { text: "For my community", href: "/senior-living" },
      { text: "." },
    ],
  },

  "senior-living": {
    id: "senior-living",
    path: "/senior-living",
    label: "For my community",
    meta: {
      title: "Tech help for every resident. Time back for your staff.",
      description:
        "Residents ask FamilyIT instead of the front desk. Offer it as a resident benefit to feature on tours, and keep families informed. Request early access for your community.",
    },
    hero: {
      headline: "Tech help for every resident. Time back for your staff.",
      lede: "Residents ask FamilyIT instead of the front desk. Offer it as a resident benefit.",
      cta: "Request early access for your community",
      priceLines: [product.communityPricingNote, product.pilotNote],
      screens: ["home"],
      outcomes: [
        "Fewer tech questions at the front desk",
        "A benefit to feature on tours",
        "Families kept informed",
      ],
    },
    screenCopy: {
      homeIntro: "Your community set me up for you.",
      signInMessage: "Signing you in with your saved login.",
      recapWho: "A resident",
      recapAction: "Call resident",
      noticeDoneTitle: "A resident confirmed their updated car insurance policy.",
      noticeDoneBody: "No action needed from you.",
      noticeLoginTitle: "A resident used the login you saved.",
      noticeLoginBody: "With their OK, they're now signed in.",
    },
    storyboard: {
      heading: "How a community uses it",
      steps: [
        { screen: "home", caption: "We onboard residents in one visit" },
        { screen: "listening", caption: "Residents just talk" },
        { screen: "signin", caption: "Staff stay out of it" },
        { screen: "recap", caption: "You get a monthly summary" },
      ],
    },
    answers: [
      {
        icon: "building",
        question: "What do our staff need to do?",
        answer:
          "Announce it and share a resident list. FamilyIT onboards residents and answers their tech questions, so your front desk doesn't have to.",
      },
      {
        icon: "card",
        question: "How does pricing work?",
        answer: `${product.communityPricingNote} ${product.pilotNote}`,
      },
      {
        icon: "lock",
        question: product.safety.questionCommunity,
        answer: product.safety.seniorLiving,
        safety: true,
      },
    ],
    faqs: [
      {
        question: "Is it a medical product?",
        answer:
          "No. FamilyIT helps with technology tasks. It does not diagnose, monitor health, or track a person's location.",
      },
      {
        question: "Which languages does it speak?",
        answer: `${product.languagesNote}, chosen during setup for each resident.`,
      },
      {
        question: "Can it see everything on a resident's screen?",
        answer:
          "It sees only what the resident chooses to share, while they are in a session. Websites can be blocked, so it cannot open pages that have been ruled out.",
      },
    ],
    form: {
      heading: "Request early access",
      closingHeading: "Bring FamilyIT to your community",
      emailLabel: "Work email",
      heroFields: ["email", "organization", "residents", "role"],
      closingFields: ["email", "organization", "residents", "role", "offerModel"],
      note: "No commitment. We'll write to you about a pilot.",
    },
    doorLine: [
      { text: "Looking for help for yourself or a parent? " },
      { text: "For me", href: "/seniors" },
      { text: ". " },
      { text: "For my parent", href: "/families" },
      { text: "." },
    ],
  },
};

export function getVariant(id: SegmentId): Variant {
  return variants[id];
}

/** The three doors on `/`. Order matches the product's likely buyer first. */
export const doors = [
  { label: "For my parent", sub: "I help a parent with their tech", href: "/families" },
  { label: "For me", sub: "I want tech help I can just talk to", href: "/seniors" },
  { label: "For my community", sub: "I run a senior living community", href: "/senior-living" },
] as const;
