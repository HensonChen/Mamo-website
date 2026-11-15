"use client";

import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import {
  offerModelOptions,
  residentRanges,
  roleOptions,
  whoForOptions,
} from "@/content/audiences";
import type { FormFieldKey, Variant } from "@/content/variants";
import { Icon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { trackMetaEvent } from "@/lib/meta/browser";

const initialState: WaitlistState = { status: "idle" };

const fieldClass =
  "mt-2 block min-h-16 w-full min-w-0 max-w-full rounded-[20px] border-2 border-edge bg-white px-4 text-xl text-ink placeholder:text-ink-soft/70 focus:border-azure-deep aria-[invalid=true]:border-alert";

type Props = {
  variant: Variant;
  /** Which fields to draw. Email is always first. */
  fields: FormFieldKey[];
  /** Distinguishes the hero form from the closing form on one page. */
  placement: "hero" | "closing";
  /** Visible heading inside the form. */
  heading: string;
  /** Rendered under the submit button: the "Not you?" line. */
  footer?: ReactNode;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-lg font-bold text-alert">
      {message}
    </p>
  );
}

export function WaitlistForm({ variant, fields, placement, heading, footer }: Props) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const [role, setRole] = useState("");
  const id = useId();
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const has = (key: FormFieldKey) => fields.includes(key);
  const consumerSwap = has("role") && role === "consumer";

  // Fire the browser event exactly once per signup. The server fires the same
  // event id through the Conversions API, so Meta counts it once.
  const firedFor = useRef<string | null>(null);
  useEffect(() => {
    if (state.status !== "success" || !state.eventName || !state.eventId) return;
    if (firedFor.current === state.eventId) return;
    firedFor.current = state.eventId;
    trackMetaEvent(state.eventName, state.eventId);
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[20px] border-2 border-ok-line bg-ok-bg p-6 text-ink sm:p-8"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-ok text-white">
          <Icon name="check" className="size-8" strokeWidth={3} />
        </span>
        <h3 className="mt-5 text-3xl font-bold leading-tight">{siteConfig.waitlist.successTitle}</h3>
        <p className="mt-3 text-xl leading-relaxed text-ink-soft">{siteConfig.waitlist.successBody}</p>
        {state.email ? (
          <p className="mt-3 text-xl">
            We&apos;ll write to <span className="font-bold">{state.email}</span>.
          </p>
        ) : null}
      </div>
    );
  }

  const name = (key: string) => `${id}-${key}`;

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-[20px] border-2 border-line bg-white p-5 text-ink shadow-[0_8px_28px_rgba(31,79,168,0.10)] sm:p-7"
      aria-labelledby={name("heading")}
      data-variant={variant.id}
      data-placement={placement}
    >
      <h2 id={name("heading")} className="text-2xl font-bold leading-tight">
        {heading}
      </h2>

      {state.status === "error" ? (
        <p
          role="alert"
          className="mt-4 rounded-[14px] border-2 border-alert/40 bg-alert/5 px-4 py-3 text-lg font-bold text-alert"
        >
          {state.fieldErrors?.variant ?? state.message}
        </p>
      ) : null}

      <input type="hidden" name="variant" value={variant.id} />
      <input type="hidden" name="source" value={variant.path} />

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={name("website")}>Leave this field empty</label>
        <input
          id={name("website")}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="size-px"
        />
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={name("email")} className="text-lg font-bold">
            {variant.form.emailLabel}
          </label>
          <input
            id={name("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? name("email-error") : undefined}
            className={fieldClass}
          />
          <FieldError id={name("email-error")} message={errors.email} />
        </div>

        {has("organization") ? (
          <div>
            <label htmlFor={name("organization")} className="text-lg font-bold">
              Community name
            </label>
            <input
              id={name("organization")}
              name="organization"
              type="text"
              autoComplete="organization"
              required
              aria-invalid={errors.organization ? true : undefined}
              aria-describedby={errors.organization ? name("organization-error") : undefined}
              className={fieldClass}
            />
            <FieldError id={name("organization-error")} message={errors.organization} />
          </div>
        ) : null}

        {has("whoFor") ? (
          <div>
            <label htmlFor={name("whoFor")} className="text-lg font-bold">
              Who is it for? <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <select
              id={name("whoFor")}
              name="whoFor"
              defaultValue=""
              aria-invalid={errors.whoFor ? true : undefined}
              className={fieldClass}
            >
              <option value="">Choose if you like</option>
              {whoForOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <FieldError id={name("whoFor-error")} message={errors.whoFor} />
          </div>
        ) : null}

        {has("residents") ? (
          <div>
            <label htmlFor={name("residents")} className="text-lg font-bold">
              How many residents? <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <select
              id={name("residents")}
              name="residents"
              defaultValue=""
              aria-invalid={errors.residents ? true : undefined}
              className={fieldClass}
            >
              <option value="">Choose if you like</option>
              {residentRanges.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <FieldError id={name("residents-error")} message={errors.residents} />
          </div>
        ) : null}

        {has("role") ? (
          <div>
            <label htmlFor={name("role")} className="text-lg font-bold">
              Your role <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <select
              id={name("role")}
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              aria-invalid={errors.role ? true : undefined}
              aria-describedby={errors.role ? name("role-error") : undefined}
              className={fieldClass}
            >
              <option value="">Choose if you like</option>
              {roleOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <FieldError id={name("role-error")} message={errors.role} />
          </div>
        ) : null}

        {has("offerModel") ? (
          <div>
            <label htmlFor={name("offerModel")} className="text-lg font-bold">
              How would you offer it? <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <select
              id={name("offerModel")}
              name="offerModel"
              defaultValue=""
              aria-invalid={errors.offerModel ? true : undefined}
              className={fieldClass}
            >
              <option value="">Choose if you like</option>
              {offerModelOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <FieldError id={name("offerModel-error")} message={errors.offerModel} />
          </div>
        ) : null}
      </div>

      {consumerSwap ? (
        // A resident or family member picked this form by mistake. Send them to
        // the page made for them, and never submit them as a community lead.
        <div
          role="status"
          className="mt-6 rounded-[20px] border-2 border-line bg-sky p-5"
          data-testid="consumer-swap"
        >
          <p className="text-xl font-bold">FamilyIT for you is here.</p>
          <p className="mt-1 text-lg text-ink-soft">This form is for community staff. Pick the page that fits you:</p>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/seniors"
              className="inline-flex min-h-16 items-center justify-center rounded-[20px] bg-azure px-6 text-xl font-bold text-white hover:bg-azure-deep"
            >
              For me
            </Link>
            <Link
              href="/families"
              className="inline-flex min-h-16 items-center justify-center rounded-[20px] border-2 border-edge bg-white px-6 text-xl font-bold text-ink hover:bg-chip"
            >
              For my parent
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex min-h-16 w-full items-center justify-center rounded-[20px] bg-azure px-6 text-xl font-bold text-white transition-colors hover:bg-azure-deep disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Adding you to the list" : variant.hero.cta}
        </button>
      )}

      <p className="mt-4 text-lg leading-relaxed text-ink-soft">{variant.form.note}</p>
      <p className="mt-1 text-base leading-relaxed text-ink-soft">{siteConfig.waitlist.privacyNote}</p>
      {footer ? <div className="mt-4 border-t-2 border-chip pt-4 text-lg leading-relaxed">{footer}</div> : null}
    </form>
  );
}
