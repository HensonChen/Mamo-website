"use server";

import { randomUUID } from "node:crypto";
import { getWaitlistProvider } from "@/lib/waitlist";
import { validateWaitlist, type WaitlistFieldErrors } from "@/lib/waitlist/validate";

export type WaitlistState =
  | { status: "idle" }
  | {
      status: "success";
      email: string;
      /** Meta event the browser should fire for this signup. Absent when nothing should be reported. */
      eventName?: "Lead" | "CrossSegmentSignup";
      eventId?: string;
    }
  | { status: "error"; message: string; fieldErrors?: WaitlistFieldErrors };

export async function joinWaitlist(
  _previous: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const provider = getWaitlistProvider();

  const sourceRaw = formData.get("source");
  const source =
    typeof sourceRaw === "string" && sourceRaw.startsWith("/") ? sourceRaw.slice(0, 200) : "/";

  // Honeypot: real visitors never see or fill this field. Bots get a fake
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

  const result = validateWaitlist(formData);
  if (!result.ok) {
    return {
      status: "error",
      message: "Check the highlighted field and try again.",
      fieldErrors: result.errors,
    };
  }

  try {
    // A repeat signup looks like a success to the visitor, but is stored once and reported once.
    if (await provider.has(result.value.email)) {
      return { status: "success", email: result.value.email };
    }

    await provider.add({
      id: randomUUID(),
      ...result.value,
      source,
      createdAt: new Date().toISOString(),
      paid: false,
      crossSegment: false,
      test: false,
      counted: false,
    });
  } catch (error) {
    console.error("[waitlist] failed to store signup", error);
    return {
      status: "error",
      message: "We couldn't save your details just now. Please try again in a moment.",
    };
  }

  return { status: "success", email: result.value.email };
}
