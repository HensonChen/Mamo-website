"use server";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { sendCapiEvent, type CapiEventName } from "@/lib/meta/capi";
import { getWaitlistProvider } from "@/lib/waitlist";
import {
  ATTRIBUTION_COOKIE,
  deviceFromUserAgent,
  fbcFromClick,
  isInAppBrowser,
  isTestEmail,
  isWithinWindow,
  parseAttribution,
} from "@/lib/waitlist/attribution";
import { validateWaitlist, type WaitlistFieldErrors } from "@/lib/waitlist/validate";

export type WaitlistState =
  | { status: "idle" }
  | {
      status: "success";
      email: string;
      /** Meta event the browser should fire for this signup. Absent when nothing should be reported. */
      eventName?: CapiEventName;
      eventId?: string;
    }
  | { status: "error"; message: string; fieldErrors?: WaitlistFieldErrors };

/** Short cookie values from Meta (`_fbp`, `_fbc`), checked before they are sent back to Meta. */
function metaCookie(value: string | undefined): string | undefined {
  return value && /^[\w.-]{1,300}$/.test(value) ? value : undefined;
}

export async function joinWaitlist(
  _previous: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const provider = getWaitlistProvider();

  const sourceRaw = formData.get("source");
  const source =
    typeof sourceRaw === "string" && sourceRaw.startsWith("/") ? sourceRaw.slice(0, 200) : "/";

  // 1. Honeypot: real visitors never see or fill this field. Bots get a fake
  // success, with no event and nothing stored as a signup.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    const variantRaw = formData.get("variant");
    try {
      await provider.logBot({
        at: new Date().toISOString(),
        variant: typeof variantRaw === "string" ? variantRaw.slice(0, 40) : undefined,
        source,
      });
    } catch (error) {
      console.error("[waitlist] failed to log bot hit", error);
    }
    return { status: "success", email: "" };
  }

  // 2. Validation.
  const result = validateWaitlist(formData);
  if (!result.ok) {
    return {
      status: "error",
      message: "Check the highlighted field and try again.",
      fieldErrors: result.errors,
    };
  }
  const input = result.value;

  const cookieStore = await cookies();
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent")?.slice(0, 400) ?? "";
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || undefined;

  const attribution = parseAttribution(cookieStore.get(ATTRIBUTION_COOKIE)?.value);
  const paid = attribution !== undefined && isWithinWindow(attribution);
  const test = isTestEmail(input.email);
  const crossSegment = paid && attribution?.seg !== input.variant;
  const counted = paid && !crossSegment && !test;

  // 5/6/7. Which event, if any, this signup reports. Test addresses report nothing.
  const eventName: CapiEventName | undefined = test ? undefined : crossSegment ? "CrossSegmentSignup" : "Lead";
  const eventId = eventName ? randomUUID() : undefined;
  const entryId = randomUUID();

  try {
    // 3. A repeat signup looks like a success to the visitor, but is stored once and reported once.
    if (await provider.has(input.email)) {
      return { status: "success", email: input.email };
    }

    await provider.add({
      id: entryId,
      ...input,
      source,
      createdAt: new Date().toISOString(),
      attribution,
      paid,
      crossSegment,
      test,
      counted,
      eventId,
      eventName,
      device: deviceFromUserAgent(userAgent),
      inApp: isInAppBrowser(userAgent),
    });
  } catch (error) {
    console.error("[waitlist] failed to store signup", error);
    return {
      status: "error",
      message: "We couldn't save your details just now. Please try again in a moment.",
    };
  }

  if (!eventName || !eventId) {
    // 4. Test address: stored, marked as a test, nothing sent.
    return { status: "success", email: input.email };
  }

  // A Conversions API failure is logged and never blocks the visitor's success screen.
  await sendCapiEvent({
    eventName,
    eventId,
    eventTime: Math.floor(Date.now() / 1000),
    sourcePath: source,
    email: input.email,
    externalId: entryId,
    segment: input.variant,
    fbc: metaCookie(cookieStore.get("_fbc")?.value) ?? fbcFromClick(attribution),
    fbp: metaCookie(cookieStore.get("_fbp")?.value),
    ip,
    userAgent: userAgent || undefined,
  });

  return { status: "success", email: input.email, eventName, eventId };
}
