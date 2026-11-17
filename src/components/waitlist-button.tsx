"use client";

import type { MouseEvent } from "react";
import { siteConfig } from "@/config/site";
import type { Variant } from "@/content/variants";
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

type Props = {
  variant: Variant;
  /** Which button on the page this is (hero or closing). */
  placement: "hero" | "closing";
  /** "dark" for the pine band. */
  tone?: "light" | "dark";
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
export function WaitlistButton({ variant, placement, tone = "light", className = "" }: Props) {
  const baseHref = tallyFormUrl(variant.id);
  const dark = tone === "dark";

  // Runs for click (also keyboard), middle click and the context menu, so
  // "open in new tab" carries the fields too. The browser reads `href` after this.
  const addFields = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      event.currentTarget.href = tallyFormUrl(variant.id, {
        fbc: pickFbc(document.cookie),
        fbp: pickFbp(document.cookie),
        clickId: makeClickId(),
      });
    } catch {
      event.currentTarget.href = baseHref;
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <a
        href={baseHref}
        onClick={addFields}
        onAuxClick={addFields}
        onContextMenu={addFields}
        data-testid="waitlist-button"
        data-placement={placement}
        data-segment={variant.id}
        className={`inline-flex min-h-14 items-center justify-center rounded-full bg-plum px-7 text-lg font-bold text-white transition-colors hover:bg-plum-deep sm:w-fit ${
          dark ? "border-2 border-paper/70" : ""
        }`}
      >
        {placement === "closing" ? variant.closing.cta : variant.hero.cta}
      </a>
      <p className={`mt-3 text-base ${dark ? "text-paper/85" : "text-ink-soft"}`}>
        {siteConfig.waitlist.buttonNote}
      </p>
    </div>
  );
}
