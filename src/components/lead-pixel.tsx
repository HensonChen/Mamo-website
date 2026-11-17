"use client";

import { useEffect } from "react";
import { trackLead } from "@/lib/meta/browser";

const KEY = "fit_lead_sent";
const TRIES = 20;
const WAIT_MS = 250;

/**
 * Fires the Meta Pixel Lead for one submitted Tally form, with Tally's
 * submission id as the event id. The Tally webhook sends the same Lead from
 * the server, and Meta counts the pair once.
 *
 * Rendered only when the thank-you page has a valid submission id. It waits a
 * moment for the Pixel to load, and remembers the id for this tab so a reload
 * does not fire it again.
 */
export function LeadPixel({ submissionId, segment }: { submissionId: string; segment?: string }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === submissionId) return;
    } catch {
      // Storage can be blocked; Meta would deduplicate a repeat anyway.
    }

    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const attempt = () => {
      if (trackLead(submissionId, segment)) {
        try {
          sessionStorage.setItem(KEY, submissionId);
        } catch {
          // Ignore.
        }
        return;
      }
      if (++tries < TRIES) timer = setTimeout(attempt, WAIT_MS);
    };
    attempt();
    return () => clearTimeout(timer);
  }, [submissionId, segment]);

  return null;
}
