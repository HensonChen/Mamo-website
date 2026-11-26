/**
 * Copy and settings for the two audience landing pages, "For me" (/seniors)
 * and "For a loved one" (/families). Everything a page says lives here as plain
 * data, so the layout components stay generic.
 *
 * Price, trial and the demo video come from `siteConfig`; they are referenced
 * here, never retyped.
 */

import { siteConfig } from "@/config/site";
import type { PageSegmentId } from "@/content/audiences";
import type { IconName } from "@/components/icons";

const { product } = siteConfig;

/** A decorative blob behind a drawing. Position and size are percentages of the picture box. */
export type BlobSpec = {
  shape: "blob-a" | "blob-b" | "blob-c" | "blob-d" | "blob-e" | "blob-f";
  color: "sun" | "blush";
  left: string;
  top: string;
  width: string;
  height: string;
  /** Degrees. */
  rotate?: number;
};

export type Variant = {
  id: PageSegmentId;
  /** Route, no trailing slash. */
  path: string;
  /** Short label used in structured data and OG images. */
  label: string;
  meta: { title: string; description: string };
  hero: {
    headline: string;
    lede: string;
  };
  /** The persona story under the hero. */
  problem: {
    heading: string;
    image: { src: string; alt: string; width: number; height: number; widthPercent: number };
    blob: BlobSpec;
    lead: string;
    body: string;
  };
  /** Three sketches with a short title and line each. */
  benefits: {
    heading: string;
    items: {
      title: string;
      body: string;
      image: { src: string; alt: string; width: number; height: number; widthPercent: number };
      blob: BlobSpec;
    }[];
  };
  demo: {
    heading: string;
    /** Same file for both pages by default. Set it in `siteConfig.demoVideo`. */
    video: { src: string | null; poster: string | null; captions: string | null };
  };
  features: {
    heading: string;
    items: { icon: IconName; title: string; body: string }[];
  };
  compare: {
    heading: string;
    /** Column titles after "Mamo". */
    others: string[];
    /** Each row: its label, then the Mamo cell, then one cell per entry in `others`. */
    rows: { label: string; cells: string[] }[];
  };
  pricing: {
    familyBlurb: string;
    familyPerks: string[];
    plusBlurb: string;
    plusPerks: string[];
  };
  faqHeading: string;
  faqs: { question: string; answer: string }[];
  closing: {
    heading: string;
    sub: string;
  };
};

const trial = product.trialNote.charAt(0).toUpperCase() + product.trialNote.slice(1);

export const variants: Record<PageSegmentId, Variant> = {
  seniors: {
    id: "seniors",
    path: "/seniors",
    label: "For me",
    meta: {
      title: "Get tech help whenever you need it, just by talking",
      description:
        "Just say what you need, and Mamo takes care of it for you. No waiting for your kids. Join the Mamo waitlist.",
    },
    hero: {
      headline: "Get tech help whenever you need it, just by talking.",
      lede: "Just say what you need, and Mamo takes care of it for you.",
    },
    problem: {
      heading: "Sometimes the hard part isn\u2019t knowing how.",
      image: {
        src: "/images/mamo/margaret-portrait.png",
        alt: "Line drawing of Margaret, with curly hair and round glasses",
        width: 704,
        height: 686,
        widthPercent: 80,
      },
      blob: { shape: "blob-f", color: "sun", left: "50%", top: "30%", width: "64%", height: "68%", rotate: 7 },
      lead: "\u201cI want to do this myself, without calling my son 2,000 miles away.\u201d",
      body: "Margaret was writing computer programs back in the 1980s, so she knows her way around technology. But when her doctor asks her to turn on the camera during a Zoom visit, she can\u2019t find the button. She could call her son Danny, but he\u2019s busy and far away in another state, and she doesn\u2019t want to be one more thing on his list.",
    },
    benefits: {
      heading: "What Mamo does for you",
      items: [
        {
          title: "Finish the hard tasks",
          body: "Fix your microphone, connect your Bluetooth earbuds, or join a video call with family. Just ask, and Mamo does it.",
          image: {
            src: "/images/mamo/seniors-benefit-1.png",
            alt: "Sketch illustrating Finish the hard tasks",
            width: 800,
            height: 600,
            widthPercent: 92,
          },
          blob: { shape: "blob-e", color: "sun", left: "18%", top: "30%", width: "46%", height: "52%" },
        },
        {
          title: "Check before you click",
          body: "Not sure a message or call is real? Ask Mamo first.",
          image: {
            src: "/images/mamo/seniors-benefit-2.png",
            alt: "Sketch illustrating Check before you click",
            width: 800,
            height: 600,
            widthPercent: 92,
          },
          blob: { shape: "blob-f", color: "blush", left: "40%", top: "18%", width: "46%", height: "52%" },
        },
        {
          title: "You\u2019re always in control",
          body: "Mamo asks before it acts and stops if anything looks wrong.",
          image: {
            src: "/images/mamo/seniors-benefit-3.png",
            alt: "Sketch illustrating You\u2019re always in control",
            width: 800,
            height: 600,
            widthPercent: 80,
          },
          blob: { shape: "blob-c", color: "sun", left: "30%", top: "34%", width: "46%", height: "52%" },
        },
      ],
    },
    demo: { heading: "How Mamo works", video: siteConfig.demoVideo },
    features: {
      heading: "Everything Mamo can do",
      items: [
        {
          icon: "setup",
          title: "Easy to set up",
          body: "Get started in a few minutes, on your own or with help from a family member.",
        },
        {
          icon: "pointer",
          title: "Gets things done for you",
          body: "Just tell Mamo what you need, like joining a doctor\u2019s visit, finding an email, or turning on the mic.",
        },
        {
          icon: "mic",
          title: "Just talk",
          body: "No menus or new apps to learn. Ask out loud, and Mamo takes care of it.",
        },
        {
          icon: "shield",
          title: "Scam check, every time",
          body: "If a link or message looks suspicious, Mamo stops and tells you why before anything happens.",
        },
        {
          icon: "people",
          title: "Family in the loop",
          body: "When you\u2019d like, Mamo lets your family know a task is done, so no one has to worry.",
        },
        {
          icon: "history",
          title: "See what Mamo did",
          body: "Look back anytime at what Mamo did for you.",
        },
      ],
    },
    compare: {
      heading: "Why not just call family?",
      others: ["Calling your family", "In-person tech help"],
      rows: [
        { label: "Help when you need it", cells: ["Anytime", "When they are free", "Business hours"] },
        { label: "Done right away", cells: ["\u2713", "Sometimes", "\u2013"] },
        { label: "No trip needed", cells: ["\u2713", "\u2713", "\u2013"] },
        { label: "Cost", cells: [`From ${product.fromPrice}/mo`, "Free, but you wait", "About $100 per visit"] },
      ],
    },
    pricing: {
      familyBlurb: "Just for you",
      familyPerks: ["Help with any task on your computer", trial],
      plusBlurb: "For you and your spouse or partner",
      plusPerks: ["Everything in Family", "Two people in the same home", trial],
    },
    faqHeading: "What people are asking",
    faqs: [
      {
        question: "Do I need to be good with computers?",
        answer: "No. If you can talk, you can use Mamo. Just ask, and Mamo handles it.",
      },
      {
        question: "Can Mamo do things for me, or just tell me what to do?",
        answer:
          "It does them for you. With your OK, Mamo opens the Zoom link, turns on your mic, or finds the right email.",
      },
      {
        question: "Will Mamo see my passwords or bank details?",
        answer:
          "No. Mamo never types your passwords or payment details. When a task needs them, it pauses and you type them yourself.",
      },
      {
        question: "Will my family see what I\u2019m doing?",
        answer:
          "Only the tasks Mamo helps you with. Your connected family can see those steps, so they know things went well. Everything else on your computer stays private.",
      },
      {
        question: "What do I need to get started?",
        answer:
          "A computer. Setup takes a few minutes, on your own or with help from a family member. We\u2019re also building Mamo for phones and tablets.",
      },
      {
        question: "When can I start, and what will it cost?",
        answer: `Mamo launches in early 2027. Join the waitlist today; there\u2019s no charge now. At launch, plans start at ${product.fromPrice} a month, with a 30-day free trial.`,
      },
    ],
    closing: {
      heading: "Be the first to try Mamo",
      sub: "Get early access when we launch in early 2027. No charge today.",
    },
  },

  families: {
    id: "families",
    path: "/families",
    label: "For a loved one",
    meta: {
      title: "Help your parents with tech, even when you\u2019re not there",
      description:
        "Mamo takes care of the tasks your parents used to call you about, and shows you how each one got solved. Join the Mamo waitlist.",
    },
    hero: {
      headline: "Help your parents with tech, even when you\u2019re not there.",
      lede: "Mamo takes care of the tasks your parents used to call you about, and shows you how each one got solved.",
    },
    problem: {
      heading: "Be their family, not their IT help desk.",
      image: {
        src: "/images/mamo/danny-portrait.png",
        alt: "Line drawing of Danny in a shirt and tie",
        width: 616,
        height: 706,
        widthPercent: 70,
      },
      blob: { shape: "blob-e", color: "blush", left: "50%", top: "32%", width: "64%", height: "68%", rotate: -6 },
      lead: "Meet Danny \u2014 a busy son who lives 2,000 miles from his mom.",
      body: "Danny often travels overseas for work. When his mom calls about a video visit or a strange text, he\u2019s in a meeting or on a flight and can\u2019t help in the moment. She lives alone, and he can\u2019t stop wondering: is she using tech safely when he can\u2019t pick up?",
    },
    benefits: {
      heading: "Your parents get help. You get peace of mind.",
      items: [
        {
          title: "Help, whenever they need it",
          body: "Your parent just asks, and Mamo gets it done, any time of day.",
          image: {
            src: "/images/mamo/families-benefit-1.png",
            alt: "Sketch illustrating Help, whenever they need it",
            width: 800,
            height: 600,
            widthPercent: 92,
          },
          blob: { shape: "blob-e", color: "sun", left: "27%", top: "28%", width: "49%", height: "56%" },
        },
        {
          title: "You stay in the loop",
          body: "Get notified when a task is done, and see each step Mamo took to help.",
          image: {
            src: "/images/mamo/families-benefit-2.png",
            alt: "Sketch illustrating You stay in the loop",
            width: 800,
            height: 600,
            widthPercent: 92,
          },
          blob: { shape: "blob-f", color: "blush", left: "40%", top: "18%", width: "46%", height: "52%" },
        },
        {
          title: "Safer by design",
          body: "Mamo checks for scams before it takes action, and never touches passwords or payments.",
          image: {
            src: "/images/mamo/families-benefit-3.png",
            alt: "Sketch illustrating Safer by design",
            width: 800,
            height: 600,
            widthPercent: 80,
          },
          blob: { shape: "blob-c", color: "sun", left: "30%", top: "34%", width: "46%", height: "52%" },
        },
      ],
    },
    demo: { heading: "How Mamo works", video: siteConfig.demoVideo },
    features: {
      heading: "Everything Mamo can do",
      items: [
        {
          icon: "setup",
          title: "Easy setup",
          body: "Install on your parent\u2019s devices in a few minutes, together or remotely.",
        },
        {
          icon: "pointer",
          title: "Gets things done for them",
          body: "Your parent just tells Mamo what they need, like joining a doctor\u2019s visit, finding an email, or turning on the mic.",
        },
        {
          icon: "mic",
          title: "Just talk",
          body: "No menus or new apps to learn. Your parent asks out loud, and Mamo takes care of it.",
        },
        {
          icon: "shield",
          title: "Scam check, every time",
          body: "If a link or message looks suspicious, Mamo stops, explains why, and lets you know.",
        },
        {
          icon: "people",
          title: "Real-time notifications",
          body: "Get a heads-up on your phone the moment a task is done, or right away if something needs you.",
        },
        {
          icon: "history",
          title: "See every step",
          body: "Look back at exactly how Mamo helped, whenever you have a minute.",
        },
      ],
    },
    compare: {
      heading: "How Mamo compares",
      others: ["Doing it yourself", "In-home tech visit", "Other tech-help services"],
      rows: [
        {
          label: "Help when your parent needs it",
          cells: ["Anytime", "When you\u2019re free", "By appointment", "Varies"],
        },
        { label: "Done right away", cells: ["\u2713", "Sometimes", "\u2013", "Sometimes"] },
        { label: "You stay informed", cells: ["\u2713", "\u2713", "\u2013", "\u2013"] },
        {
          label: "Cost",
          cells: [`From ${product.fromPrice}/mo`, "Your time", "About $100 per visit", "About $20\u201330/mo"],
        },
      ],
    },
    pricing: {
      familyBlurb: "For one parent",
      familyPerks: ["Updates and controls on your phone", trial],
      plusBlurb: "For both parents in one home",
      plusPerks: ["Everything in Family", "Two seniors in the same home", trial],
    },
    faqHeading: "What families are asking",
    faqs: [
      {
        question: "How does setup work?",
        answer:
          "Install Mamo on your parent\u2019s computer in a few minutes, either sitting together or remotely.",
      },
      {
        question: "Can Mamo see my parent\u2019s passwords or bank details?",
        answer:
          "No. Mamo never types passwords or payment details. When a task needs them, it pauses and your parent types them.",
      },
      {
        question: "What do I see on my side?",
        answer:
          "A notification on your phone when a task is done or something needs you, plus a step-by-step history of the tasks Mamo helped with. Only those tasks are shared; the rest of your parent\u2019s computer stays private. You can pause Mamo anytime.",
      },
      {
        question: "What happens if Mamo spots a scam?",
        answer: "It stops before taking any action, explains the risk to your parent, and alerts you right away.",
      },
      {
        question: "What if my parent doesn\u2019t want help from an app?",
        answer:
          "Mamo doesn\u2019t feel like an app. There are no menus or new screens to learn. Your parent just talks, and Mamo answers patiently, as many times as they need.",
      },
      {
        question: "What will it cost?",
        answer: `Mamo launches in early 2027, and joining the waitlist is free. At launch, Family is ${product.plans.family.monthly} a month (${product.plans.family.yearly} a year), and Family Plus covers two parents at home for ${product.plans.familyPlus.monthly} a month. Both start with a 30-day free trial.`,
      },
    ],
    closing: {
      heading: "Be the first to try Mamo",
      sub: "Get early access for your family when we launch in early 2027. No charge today.",
    },
  },
};

export function getVariant(id: PageSegmentId): Variant {
  return variants[id];
}
