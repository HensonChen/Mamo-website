"use client";

import { useEffect } from "react";
import { isSegmentId } from "@/content/audiences";

const COOKIE = "fit_attr";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * Remembers which paid ad brought the visitor, in a first-party cookie, so
 * the waitlist action can trace a signup to its segment and its ad.
 *
 * Rendered on the three segment pages only. A visit to `/`, or to a page by
 * following a link on the site, has no ad parameters and changes nothing:
 * only a new paid click replaces the cookie, so the last paid click wins.
 * It renders nothing.
 */
export function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seg = params.get("fit_seg");
    const fbclid = params.get("fbclid");
    const paidClick = params.get("utm_medium") === "paid_social" || fbclid !== null;
    if (!isSegmentId(seg) || !paidClick) return;

    const value = {
      seg,
      campaign: params.get("utm_campaign") ?? undefined,
      adset: params.get("utm_term") ?? undefined,
      ad: params.get("utm_content") ?? undefined,
      placement: params.get("fit_place") ?? undefined,
      fbclid: fbclid ?? undefined,
      path: window.location.pathname,
      at: Date.now(),
    };
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  }, []);

  return null;
}
