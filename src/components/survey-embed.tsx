"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ButtonLink } from "@/components/ui";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

/** The form id inside a Tally.FormSubmitted postMessage, if this message is one. */
function submittedFormId(data: unknown): string | undefined {
  if (typeof data !== "string" || !data.includes("Tally.FormSubmitted")) return undefined;
  try {
    const parsed = JSON.parse(data) as { payload?: { formId?: unknown } };
    return typeof parsed.payload?.formId === "string" ? parsed.payload.formId : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The follow-up survey on the thank-you page. `src` is the embed URL built on
 * the server from a checked submission id. Hearing that this form was submitted
 * only reveals the way back. It does not send a Meta event: the Lead already
 * fired for the waitlist submission.
 */
export function SurveyEmbed({ src, formId, back }: { src: string; formId: string; back: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://tally.so") return;
      if (submittedFormId(event.data) === formId) setDone(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [formId]);

  return (
    <>
      <div className="mx-auto mt-8 w-full max-w-2xl">
        <iframe
          data-tally-src={src}
          width="100%"
          height={640}
          title="A few questions about you"
          className="w-full border-0"
        />
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
          onReady={() => {
            window.Tally?.loadEmbeds();
          }}
        />
      </div>
      {done ? (
        <div className="mt-8 flex justify-center">
          <ButtonLink href={back}>Back to the page</ButtonLink>
        </div>
      ) : null}
    </>
  );
}
