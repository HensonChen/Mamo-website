"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  familyFrames,
  firstFrameOfStep,
  soloFrames,
} from "@/components/landing/how-timeline";
import { PhoneScreen } from "@/components/phone/screen";
import { Container } from "@/components/ui";
import type { Variant } from "@/content/variants";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * "How it works": four steps beside a phone that plays through them.
 *
 * - Plays by itself only while the section is on screen, and never for
 *   visitors who asked for reduced motion.
 * - A visible Pause / Play button, because content that moves by itself for
 *   more than five seconds needs one.
 * - Each step is a button that jumps to its first screen.
 *
 * Below `lg` the steps shrink to a row of numbers with the current step's
 * words under them, and the phone(s) go underneath.
 */
export function HowItWorks({ variant }: { variant: Variant }) {
  const { howItWorks, screenCopy } = variant;
  const family = howItWorks.mode === "family";
  const frames = family ? familyFrames : soloFrames;

  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  // null: the visitor has not chosen, so the default applies (play, unless reduced motion).
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const wantsPlay = choice ? choice === "play" : !reduced;
  const playing = wantsPlay && visible;

  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % frames.length), frames[index].ms);
    return () => clearTimeout(timer);
  }, [playing, index, frames]);

  const frame = frames[index];
  const activeStep = frame.step;
  const phoneScale = family
    ? "[--s:0.3] min-[360px]:[--s:0.36] min-[420px]:[--s:0.42] sm:[--s:0.55] lg:[--s:0.6] xl:[--s:0.72]"
    : "[--s:0.55] min-[360px]:[--s:0.62] sm:[--s:0.7] lg:[--s:0.8]";

  return (
    <section
      ref={sectionRef}
      id="how"
      aria-labelledby="how-heading"
      className="bg-pine py-[4.5rem] text-paper md:py-28"
    >
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="min-w-0">
          <h2 id="how-heading" className="text-h2 font-bold text-paper lg:text-h2-lg">
            {howItWorks.heading}
          </h2>

          <ol className="mt-8 flex gap-3 lg:mt-10 lg:flex-col lg:gap-4">
            {howItWorks.steps.map((label, step) => {
              const on = step === activeStep;
              return (
                <li key={label}>
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    aria-label={`Step ${step + 1}: ${label}`}
                    onClick={() => setIndex(firstFrameOfStep(frames, step))}
                    className={`flex w-full items-center gap-5 rounded-3xl text-left text-2xl font-bold leading-snug transition-colors lg:px-5 lg:py-4 lg:text-[1.625rem] ${
                      on ? "text-paper lg:bg-pine-2" : "text-paper/75 hover:text-paper lg:hover:bg-pine-2/60"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-paper text-xl transition-colors lg:size-11 ${
                        on ? "bg-paper text-pine" : "bg-transparent text-paper"
                      }`}
                    >
                      {step + 1}
                    </span>
                    <span aria-hidden="true" className="hidden lg:inline">
                      {label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-5 min-h-[4.5rem] text-2xl font-bold leading-snug lg:hidden" aria-hidden="true">
            {howItWorks.steps[activeStep]}
          </p>

          <button
            type="button"
            onClick={() => setChoice(wantsPlay ? "pause" : "play")}
            className="mt-4 inline-flex min-h-12 items-center gap-3 rounded-full border-2 border-paper/50 px-5 text-lg font-bold text-paper hover:bg-pine-2 lg:mt-8"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {wantsPlay ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
            </svg>
            {wantsPlay ? "Pause the demo" : "Play the demo"}
          </button>
        </div>

        <div className="flex items-start justify-center gap-3 sm:gap-6 lg:justify-end">
          {"parent" in frame ? (
            <>
              <Phone label="Parents">
                <PhoneScreen key={frame.parent} id={frame.parent} copy={screenCopy} className={phoneScale} />
              </Phone>
              <Phone label="You">
                <PhoneScreen key={frame.you} id={frame.you} copy={screenCopy} className={phoneScale} />
              </Phone>
            </>
          ) : (
            <PhoneScreen key={frame.screen} id={frame.screen} copy={screenCopy} className={phoneScale} />
          )}
        </div>
      </Container>
    </section>
  );
}

/** A phone with a caption under it, for the two-phone version. */
function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {children}
      <span className="text-lg font-bold text-paper/80 sm:text-xl">{label}</span>
    </div>
  );
}
