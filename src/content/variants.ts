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
  | "clarify"
  | "answering"
  | "email"
  | "opensite"
  | "signin"
  | "explain"
  | "confirmed"
  | "idle"
  | "notice-asked"
  | "notice-login"
  | "notice-done"
  | "recap";

/** One piece of the "Not you?" line: plain text, or a link to another page. */
export type DoorPart = { text: string; href?: string };

export type HeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * Desktop placement, copied from the mockup background shorthand.
   * `position` is background-position. `size` is background-size:
   * a width (`140% auto`, `100% auto`) or `cover`.
   */
  position: string;
  size: "140% auto" | "100% auto" | "cover";
  /** Color stops for the paper fade across the photo, desktop only. */
  fade: string;
  /** CSS object-position for the picture shown under the copy on a phone. */
  mobilePosition: string;
};

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
    /** Button text. */
    cta: string;
    /** Price or pricing lines shown above the button. */
    priceLines: string[];
    image: HeroImage;
  };
  /** The slogan and the three numbered points under the hero. */
  why: { slogan: string; points: [string, string, string] };
  howItWorks: {
    heading: string;
    /** "solo": one phone. "family": the parent's phone and the family member's phone. */
    mode: "solo" | "family";
    /** Four labels, one per step. */
    steps: [string, string, string, string];
  };
  /** Wording for the helper screens, so they fit who is looking at the page. */
  screenCopy: {
    homeIntro: string;
    openSiteMessage: string;
    signInMessage: string;
    confirmedMessage: string;
    recapWho: string;
    recapAction: string;
    noticeAskedTitle: string;
    noticeAskedBody: string;
    noticeLoginTitle: string;
    noticeLoginBody: string;
    noticeDoneTitle: string;
    noticeDoneBody: string;
  };
  faqs: { question: string; answer: string }[];
  closing: {
    heading: string;
    sub: string;
    cta: string;
    note: string;
  };
  doorLine: DoorPart[];
};

const consumerPriceLines = [`${product.consumerPrice}, ${product.trialNote}.`];

const closingNote = siteConfig.waitlist.privacyNote;

export const variants: Record<SegmentId, Variant> = {
  families: {
    id: "families",
    path: "/families",
    label: "For my parent",
    meta: {
      title: "Be their family, not their help desk",
      description:
        "FamilyIT helps your parent with technology issues, day or night. You get a short note when it's done. Stay close and worry less. Join the waitlist.",
    },
    hero: {
      headline: "Be their family, not their help desk.",
      lede: "FamilyIT helps your parent with technology issues, day or night. You get a short note when it's done. Stay close and worry less, for both of you.",
      cta: "Join the waitlist",
      // priceLines: consumerPriceLines,
      priceLines: [],
      image: {
        src: "/images/hero-families.jpg",
        alt: "A woman smiling at her phone in a bright kitchen, with a photo of her mother on the shelf behind her.",
        width: 2400,
        height: 1792,
        position: "100% 30%",
        size: "100% auto",
        fade: "rgba(251, 250, 247, 0.97) 0%, rgba(251, 250, 247, 0.95) 45%, rgba(251, 250, 247, 0.6) 56%, rgba(251, 250, 247, 0) 66%",
        mobilePosition: "75% 30%",
      },
    },
    why: {
      slogan: "Less worrying. More time together.",
      points: [
        "Help seniors with everyday tech issues.",
        "Families get real time notifications.",
        "Peace of mind, with you in control.",
      ],
    },
    howItWorks: {
      heading: "How it works",
      mode: "family",
      steps: [
        "Mom asks for help, just by talking",
        "You get a heads-up she's getting help",
        "You're told when your login is used",
        "Done. You get the recap",
      ],
    },
    screenCopy: {
      homeIntro: "I\u2019m FamilyIT, your tech helper. Jane set me up for you.",
      openSiteMessage:
        "I opened Evergreen\u2019s website for you. Jane saved your login. Want me to sign you in?",
      signInMessage: "Signing you in with the login Jane saved.",
      confirmedMessage: "All done! Evergreen got your confirmation. I\u2019ve let Jane know.",
      recapWho: "Mom",
      recapAction: "Call Mom",
      noticeAskedTitle: "Mom is getting help",
      noticeAskedBody: "Mom asked FamilyIT about a message from her car insurance.",
      noticeLoginTitle: "Mom used the insurance login you saved.",
      noticeLoginBody: "With her OK, she\u2019s now signed in to Evergreen.",
      noticeDoneTitle: "Mom confirmed her updated car insurance policy.",
      noticeDoneBody: "No action needed from you.",
    },
    faqs: [
      {
        question: "Will I see everything my parent does?",
        answer:
          "You see a summary of what FamilyIT helped with. Your parent is told what is shared, and setup starts with a conversation about it.",
      },
      {
        question: "Can I be involved even though I live far away?",
        answer:
          "Yes. You can set things up and receive updates, while your parent handles their own day-to-day. How involved you are is up to your parent.",
      },
      {
        question: "What if it makes a mistake?",
        answer:
          "FamilyIT guides and explains each step. For sensitive steps like payments or forms, it asks your parent to confirm, and it can ask you to approve, depending on the level you choose.",
      },
    ],
    closing: {
      heading: "Be first to try FamilyIT.",
      sub: `${product.launchWindow}.`,
      cta: "Join the waitlist",
      note: closingNote,
    },
    doorLine: [
      { text: "Run a senior living community? " },
      { text: "For my community", href: "/senior-living" },
      { text: "." },
    ],
  },

  seniors: {
    id: "seniors",
    path: "/seniors",
    label: "For me",
    meta: {
      title: "Get tech help whenever you need it, just by talking",
      description:
        "Tap one button and say what's wrong. FamilyIT helps you get things done on your own, step by step. Join the waitlist.",
    },
    hero: {
      headline: "Get tech help whenever you need it, just by talking.",
      lede: "FamilyIT helps you get things done on your own, step by step. Just tap one button and say what's wrong.",
      cta: "Join the waitlist",
      // priceLines: consumerPriceLines,
      priceLines: [],
      image: {
        src: "/images/hero-seniors.jpg",
        alt: "An older woman talking to her phone from an armchair in a bright living room.",
        width: 2576,
        height: 1438,
        position: "0% 20%",
        size: "140% auto",
        fade: "rgba(251, 250, 247, 0.97) 0%, rgba(251, 250, 247, 0.93) 36%, rgba(251, 250, 247, 0) 58%",
        mobilePosition: "55% 25%",
      },
    },
    why: {
      slogan: "You don't have to be techy to get things done.",
      points: [
        "Just talk, no typing needed.",
        "Get help anytime, step by step.",
        "Stay safe from scams.",
      ],
    },
    howItWorks: {
      heading: "How it works",
      mode: "solo",
      steps: [
        "Ask out loud",
        "It checks my email is real",
        "It signs me in, with my OK",
        "Tap Confirm. Done.",
      ],
    },
    screenCopy: {
      homeIntro: "I\u2019m FamilyIT, your tech helper. Jane set me up for you.",
      openSiteMessage:
        "I opened Evergreen\u2019s website for you. Jane saved your login. Want me to sign you in?",
      signInMessage: "Signing you in with the login Jane saved.",
      confirmedMessage: "All done! Evergreen got your confirmation. I\u2019ve let Jane know.",
      recapWho: "You",
      recapAction: "Done",
      noticeAskedTitle: "You are getting help",
      noticeAskedBody: "You asked FamilyIT about a message from your car insurance.",
      noticeLoginTitle: "FamilyIT signed you in.",
      noticeLoginBody: "With your OK.",
      noticeDoneTitle: "You confirmed your updated car insurance policy.",
      noticeDoneBody: "All done.",
    },
    faqs: [
      {
        question: "Can it see everything on my screen?",
        answer:
          "It only sees what you choose to share during a session. Your family can also block websites, so it cannot open pages they have ruled out.",
      },
      {
        question: "Will my family see everything I do?",
        answer:
          "Your family sees a summary of what FamilyIT helped with. You are told what is shared, and setup starts with a conversation about it.",
      },
      {
        question: "How is it different from a chatbot?",
        answer:
          "A chatbot tells you what to do. FamilyIT talks with you, sees your screen, and guides you through each step as it happens.",
      },
    ],
    closing: {
      heading: "Be first to try FamilyIT.",
      sub: `${product.launchWindow}.`,
      cta: "Join the waitlist",
      note: closingNote,
    },
    doorLine: [
      { text: "Helping a parent? " },
      { text: "For my parent", href: "/families" },
      { text: ". \n Run a senior living community? " },
      { text: "For my community", href: "/senior-living" },
      { text: "." },
    ],
  },

  "senior-living": {
    id: "senior-living",
    path: "/senior-living",
    label: "For my community",
    meta: {
      title: "Your staff are trained for care, not Wi-Fi passwords",
      description:
        "FamilyIT answers residents' tech questions, so your staff can spend their time on care. Request early access for your community.",
    },
    hero: {
      headline: "Your staff are trained for care, not Wi-Fi passwords.",
      lede: "FamilyIT answers residents' tech questions, so your staff can spend their time on care.",
      cta: "Request community early access",
      priceLines: [product.communityPricingNote, product.pilotNote],
      image: {
        src: "/images/hero-senior-living.jpg",
        alt: "A care worker chatting with residents over tea and cards in a sunlit community room.",
        width: 2400,
        height: 1792,
        position: "50% 30%",
        size: "cover",
        fade: "rgba(251, 250, 247, 1) 0%, rgba(251, 250, 247, 1) 42%, rgba(251, 250, 247, 0.5) 58%, rgba(251, 250, 247, 0) 75%",
        mobilePosition: "70% 40%",
      },
    },
    why: {
      slogan: "More time for care. Less time on tech support.",
      points: [
        "Staff time returns to care.",
        "Residents protected from scams.",
        "Helps your community stand out.",
      ],
    },
    howItWorks: {
      heading: "How it works",
      mode: "solo",
      steps: [
        "A resident asks out loud",
        "It checks the email is real",
        "It signs them in, with their OK",
        "They tap Confirm. Done.",
      ],
    },
    screenCopy: {
      homeIntro: "I\u2019m FamilyIT, your tech helper. Your community set me up for you.",
      openSiteMessage:
        "I opened Evergreen\u2019s website for you. Your saved login is ready. Want me to sign you in?",
      signInMessage: "Signing you in with your saved login.",
      confirmedMessage: "All done! Evergreen got your confirmation.",
      recapWho: "A resident",
      recapAction: "Call resident",
      noticeAskedTitle: "A resident is getting help",
      noticeAskedBody: "A resident asked FamilyIT about a message from their car insurance.",
      noticeLoginTitle: "A resident used the login you saved.",
      noticeLoginBody: "With their OK, they\u2019re now signed in.",
      noticeDoneTitle: "A resident confirmed their updated car insurance policy.",
      noticeDoneBody: "No action needed from you.",
    },
    faqs: [
      {
        question: "How does this fit alongside our existing IT provider?",
        answer:
          "We don't touch your clinical or corporate systems. We cover residents' personal devices and coordinate with your IT provider where the two meet, such as resident Wi-Fi.",
      },
      {
        question: "What do our staff need to do?",
        answer:
          "Announce the service and share a resident list. FamilyIT onboards residents and answers their tech questions, so your front desk doesn't have to.",
      },
      {
        question: "Who pays: the center or the family?",
        answer:
          "We're designing for both models and will discuss what suits your community during early access. Join the waitlist and tell us about your community.",
      },
    ],
    closing: {
      heading: "Request early access for your community",
      sub: "No commitment. We'll write to you about a pilot.",
      cta: "Request early access",
      note: closingNote,
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
