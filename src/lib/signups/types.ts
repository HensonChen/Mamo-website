import type { SegmentId } from "@/content/audiences";

/** What happened when the Lead was sent to Meta's Conversions API. */
export type CapiOutcome = "sent" | "dry-run" | "skipped" | "skipped-test" | "failed";

/**
 * One real signup, written by the Tally webhook. There is no email and no
 * email hash here: the email stays in Tally. This log exists for the
 * duplicate check (`submissionId`) and for the report.
 */
export type SignupRecord = {
  /** Tally's id for the submission. Also Meta's `event_id` for the Lead. */
  submissionId: string;
  formId: string;
  /** The segment of the form that was submitted. This is the one that counts. */
  segment: SegmentId;
  /** The segment the button put in the hidden field, kept for comparison only. */
  hiddenSegment?: string;
  /** Random id the button made when it was clicked. */
  clickId?: string;
  fbcPresent: boolean;
  fbpPresent: boolean;
  /** The ad click is inside the attribution window. */
  paid: boolean;
  /** Team or test address. Stored, never counted, never sent to Meta. */
  test: boolean;
  /** Paid, and not a test. This is the number cost per signup uses. */
  counted: boolean;
  capi: CapiOutcome;
  /** When Tally says the form was submitted (ISO 8601). */
  createdAt: string;
  /** When our server got the webhook (ISO 8601). */
  receivedAt: string;
};

/** Where signup records are kept. Swap in a database or KV store for production. */
export interface SignupStore {
  readonly name: string;
  has(submissionId: string): Promise<boolean>;
  add(record: SignupRecord): Promise<void>;
}
