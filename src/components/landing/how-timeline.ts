import type { ScreenId } from "@/content/variants";

/**
 * The "How it works" demo as data, ported from the mockup's two timelines.
 * Each frame lasts `ms` and belongs to one of the four steps. `step` starts
 * at 0.
 */
export type SoloFrame = { screen: ScreenId; ms: number; step: number };
export type FamilyFrame = { parent: ScreenId; you: ScreenId; ms: number; step: number };

/** One phone: the parent's. Nine screens. */
export const soloFrames: SoloFrame[] = [
  { screen: "home", ms: 2500, step: 0 },
  { screen: "listening", ms: 6400, step: 0 },
  { screen: "clarify", ms: 3200, step: 0 },
  { screen: "answering", ms: 3400, step: 0 },
  { screen: "email", ms: 4600, step: 1 },
  { screen: "opensite", ms: 4000, step: 2 },
  { screen: "signin", ms: 6000, step: 2 },
  { screen: "explain", ms: 4000, step: 3 },
  { screen: "confirmed", ms: 5000, step: 3 },
];

/** Two phones: the parent's, and the family member's. Ten frames. */
export const familyFrames: FamilyFrame[] = [
  { parent: "home", you: "idle", ms: 2500, step: 0 },
  { parent: "listening", you: "idle", ms: 6400, step: 0 },
  { parent: "clarify", you: "notice-asked", ms: 3200, step: 1 },
  { parent: "answering", you: "notice-asked", ms: 3400, step: 1 },
  { parent: "email", you: "notice-asked", ms: 4600, step: 1 },
  { parent: "opensite", you: "notice-asked", ms: 4000, step: 1 },
  { parent: "signin", you: "notice-login", ms: 6000, step: 2 },
  { parent: "explain", you: "notice-login", ms: 4000, step: 2 },
  { parent: "confirmed", you: "notice-done", ms: 4000, step: 3 },
  { parent: "confirmed", you: "recap", ms: 7000, step: 3 },
];

/** The first frame of each step, where a click on that step jumps to. */
export function firstFrameOfStep(frames: { step: number }[], step: number): number {
  return Math.max(
    0,
    frames.findIndex((frame) => frame.step === step),
  );
}
