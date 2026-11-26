"use client";

import type { MouseEvent } from "react";
import type { SegmentId } from "@/content/audiences";
import { pickFbc, pickFbp } from "@/lib/attribution";
import { tallyFormUrl } from "@/lib/tally";

/** A random v4 id. Uses getRandomValues, which also works on pages that are not served over https. */
function makeClickId(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (n) => n.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Looks of the button, from the mockups:
 * - `sun`: yellow, for use on a teal card or band
 * - `teal`: solid teal, for the sand page and the header
 * - `outline`: white with a teal border, the second pricing card
 */
export type WaitlistTone = "sun" | "teal" | "outline";

const tones: Record<WaitlistTone, string> = {
  sun: "border-2 border-sun bg-sun text-teal hover:border-sun-deep hover:bg-sun-deep",
  teal: "border-2 border-teal bg-teal text-white hover:bg-teal-soft",
  outline: "border-2 border-teal bg-white text-teal hover:bg-sand",
};

const sizes = {
  sm: "min-h-12 px-5 text-base sm:px-6",
  lg: "min-h-[3.75rem] px-8 text-lg",
};

type Props = {
  /** Which Tally form it opens. Pages without an audience use "families". */
  segment: SegmentId;
  /** Where on the page this button is. Written to `data-placement` for tests and reports. */
  placement: "header" | "hero" | "pricing" | "closing";
  tone?: WaitlistTone;
  size?: keyof typeof sizes;
  label?: string;
  className?: string;
};

/**
 * The waitlist button. It is a plain link to the segment's Tally form, in the
 * same tab. The server renders the link with the segment already set, so it
 * works with JavaScript off.
 *
 * Just before the browser follows the link, the click handler adds the Meta
 * click value (`fbc`), the Meta browser id (`fbp`) and a fresh click id as
 * hidden Tally fields. No Meta event fires on click: a signup is a submitted
 * form, and the thank-you page and the webhook report it.
 */
export function WaitlistButton({
  segment,
  placement,
  tone = "teal",
  size = "lg",
  label = "Join the waitlist",
  className = "",
}: Props) {
  const baseHref = tallyFormUrl(segment);

  // Runs for click (also keyboard), middle click and the context menu, so
  // "open in new tab" carries the fields too. The browser reads `href` after this.
  const addFields = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      event.currentTarget.href = tallyFormUrl(segment, {
        fbc: pickFbc(document.cookie),
        fbp: pickFbp(document.cookie),
        clickId: makeClickId(),
      });
    } catch {
      event.currentTarget.href = baseHref;
    }
  };

  return (
    <a
      href={baseHref}
      onClick={addFields}
      onAuxClick={addFields}
      onContextMenu={addFields}
      data-testid="waitlist-button"
      data-placement={placement}
      data-segment={segment}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold transition-colors ${sizes[size]} ${tones[tone]} ${className}`}
    >
      {label}
    </a>
  );
}
