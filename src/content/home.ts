/**
 * Copy for the home page (`/`). It has no audience of its own: its waitlist
 * buttons open the families form, and its "Who is Mamo for?" cards send the
 * visitor to the page that fits.
 */

import { siteConfig } from "@/config/site";

const { product } = siteConfig;

export type ChatMessage = {
  who: "Mom" | "Danny";
  /** Text, or an emoji-only reaction. */
  text: string;
  emoji?: boolean;
};

export const home = {
  meta: {
    title: "Ask Mamo, the tech helper for the whole family",
    description: siteConfig.description,
  },
  hero: {
    headline: "Ask Mamo, the tech helper for the whole family.",
    lede: "Ask out loud and get it done. Everyone stays in the loop.",
  },
  /** The scene that plays once as it scrolls into view. Mom and Danny take turns. */
  chat: [
    {
      who: "Mom",
      text: "Danny, I\u2019m in the video call with Dr. Lee but he says he can\u2019t hear me. What do I press?",
    },
    { who: "Danny", text: "Driving right now, Mom. Look for the microphone button?" },
    { who: "Mom", text: "There are so many buttons. He\u2019s waiting." },
    { who: "Danny", text: "\ud83d\ude1f", emoji: true },
  ] satisfies ChatMessage[],
  pain: {
    heading: "Tech help shouldn\u2019t be so hard.",
    cards: [
      {
        quote: "\u201cI can\u2019t fix Mom\u2019s computer from 2,000 miles away.\u201d",
        body: "Every small tech problem turns into a phone call. Adult children can\u2019t see the screen, are often busy, and worry when they can\u2019t pick up.",
        image: {
          src: "/images/mamo/danny-sketch.png",
          alt: "Line drawing of the son, Danny, in a shirt and tie",
          width: 560,
          height: 696,
        },
        blob: "danny" as const,
      },
      {
        quote: "\u201cI\u2019d rather do it myself than call my son again.\u201d",
        body: "Every small tech problem means asking the kids for help. Parents wait for a call back and hate feeling like a burden.",
        image: {
          src: "/images/mamo/mom-sketch.png",
          alt: "Line drawing of Mom, with curly hair and round glasses",
          width: 700,
          height: 686,
        },
        blob: "mom" as const,
      },
    ],
  },
  paths: {
    heading: "Who is Mamo for?",
    cards: [
      {
        href: "/families",
        title: "I want to help my parent",
        body: "Give your mom or dad patient, safe tech help \u2014 and stay in the loop from anywhere.",
        cta: "See how it works for families \u2192",
      },
      {
        href: "/seniors",
        title: "I want help for myself",
        body: "Get tech problems solved, just by talking. No waiting for your kids.",
        cta: "See how it works for you \u2192",
      },
    ],
    priceLine: `Plans from ${product.fromPrice}/month`,
    priceDetail: ` \u00b7 ${product.trialNote} \u00b7 No charge today`,
  },
  closing: {
    heading: "Be the first to try Mamo",
    sub: "Get early access when we launch in early 2027. No charge today.",
  },
};
