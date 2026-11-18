"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  text: string;
  /** Type one character or one word at a time. */
  unit?: "char" | "word";
  /** Milliseconds between steps. */
  intervalMs: number;
  /** Keep the room the full text needs, so nothing around it moves while it types. */
  reserve?: boolean;
};

/** Index just after each word, so a word-by-word caption can be cut with `slice`. */
function wordEnds(text: string): number[] {
  const ends: number[] = [];
  const re = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) ends.push(match.index + match[0].length);
  return ends;
}

/**
 * A live caption that types itself, like the demo's voice captions. With
 * reduced motion on, the full text is shown at once. The screens are
 * decorative, so the text is not announced as it changes.
 */
export function TypedText({ text, unit = "char", intervalMs, reserve = false }: Props) {
  const reduced = useReducedMotion();
  const ends = unit === "word" ? wordEnds(text) : null;
  const steps = ends ? ends.length : text.length;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setCount((n) => {
        if (n >= steps) {
          clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [reduced, steps, intervalMs]);

  const shown = reduced ? steps : Math.min(count, steps);
  const cut = ends ? (shown === 0 ? 0 : ends[shown - 1]) : shown;

  return (
    <>
      <span>{text.slice(0, cut)}</span>
      {reserve ? (
        <span aria-hidden="true" style={{ color: "transparent" }}>
          {text.slice(cut)}
        </span>
      ) : null}
    </>
  );
}
