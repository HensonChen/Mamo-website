import {
  isOfferModel,
  isResidentRange,
  isRole,
  isSegmentId,
  isWhoFor,
  type OfferModel,
  type ResidentRange,
  type Role,
  type SegmentId,
  type WhoFor,
} from "@/content/audiences";

export type WaitlistFieldErrors = Partial<
  Record<"email" | "organization" | "residents" | "role" | "offerModel" | "whoFor" | "variant", string>
>;

export type WaitlistInput = {
  email: string;
  variant: SegmentId;
  whoFor?: WhoFor;
  organization?: string;
  residents?: ResidentRange;
  role?: Role;
  offerModel?: OfferModel;
};

type ValidationResult =
  | { ok: true; value: WaitlistInput }
  | { ok: false; errors: WaitlistFieldErrors };

const MAX_EMAIL = 254;
const MAX_ORG = 160;

// Pragmatic, not RFC-perfect: one @, no spaces, a dot in the domain.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateWaitlist(formData: FormData): ValidationResult {
  const errors: WaitlistFieldErrors = {};

  const variantRaw = text(formData.get("variant"));
  if (!isSegmentId(variantRaw)) {
    return { ok: false, errors: { variant: "Something went wrong with this page. Reload and try again." } };
  }
  const variant: SegmentId = variantRaw;

  const email = text(formData.get("email")).toLowerCase();
  if (!email) {
    errors.email = "Enter your email address so we can let you know.";
  } else if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    errors.email = "That email address doesn't look right. Check for typos.";
  }

  let whoFor: WhoFor | undefined;
  let organization: string | undefined;
  let residents: ResidentRange | undefined;
  let role: Role | undefined;
  let offerModel: OfferModel | undefined;

  if (variant === "families") {
    const raw = text(formData.get("whoFor"));
    if (raw) {
      if (isWhoFor(raw)) whoFor = raw;
      else errors.whoFor = "Choose one of the options in the list.";
    }
  }

  if (variant === "senior-living") {
    const org = text(formData.get("organization"));
    if (!org) {
      errors.organization = "Enter your community's name so we can reach the right team.";
    } else if (org.length > MAX_ORG) {
      errors.organization = `Keep the community name under ${MAX_ORG} characters.`;
    } else {
      organization = org;
    }

    const residentsRaw = text(formData.get("residents"));
    if (residentsRaw) {
      if (isResidentRange(residentsRaw)) residents = residentsRaw;
      else errors.residents = "Choose one of the options in the list.";
    }

    const roleRaw = text(formData.get("role"));
    if (roleRaw) {
      if (!isRole(roleRaw)) {
        errors.role = "Choose one of the options in the list.";
      } else if (roleRaw === "consumer") {
        // Only reachable without JavaScript. With it, the form swaps the button for the consumer doors.
        errors.role =
          "This form is for community staff. For yourself or a parent, use the For me or For my parent pages.";
      } else {
        role = roleRaw;
      }
    }

    const offerRaw = text(formData.get("offerModel"));
    if (offerRaw) {
      if (isOfferModel(offerRaw)) offerModel = offerRaw;
      else errors.offerModel = "Choose one of the options in the list.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: { email, variant, whoFor, organization, residents, role, offerModel },
  };
}
