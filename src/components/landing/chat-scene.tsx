"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ChatMessage } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const subscribeNothing = () => () => {};

/** False while the server renders and during hydration, true afterwards. */
function useIsClient(): boolean {
  return useSyncExternalStore(subscribeNothing, () => true, () => false);
}

/**
 * The Mom and Danny text thread. It plays once, when it scrolls into view:
 * a typing bubble, then the message, one turn per second.
 *
 * Without JavaScript, and for visitors who asked for reduced motion, the
 * whole thread is simply shown.
 */
export function ChatScene({ messages }: { messages: ChatMessage[] }) {
  const isClient = useIsClient();
  const reduced = useReducedMotion();
  const animate = isClient && !reduced;
  const total = messages.length * 2;

  // Step 2k-1: message k is being typed. Step 2k: message k has arrived.
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!animate || !node) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const play = () => {
      let n = 0;
      const tick = () => {
        n += 1;
        setStep(n);
        if (n < total) timer = setTimeout(tick, 1000);
      };
      timer = setTimeout(tick, 600);
    };

    if (typeof IntersectionObserver === "undefined") {
      play();
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [animate, total]);

  const shown = animate ? step : total;
  const typingIndex = shown % 2 === 1 ? (shown + 1) / 2 - 1 : -1;
  const typing = typingIndex >= 0 ? messages[typingIndex] : undefined;

  return (
    <section ref={rootRef} id="scene" aria-label="A text thread between Mom and Danny" className="px-5 py-14 sm:px-8 md:py-20 lg:py-[6.25rem]">
      <div className="mx-auto min-h-[25rem] max-w-[47.5rem] sm:min-h-[24.375rem] md:px-12">
        <div aria-live="polite" className="flex flex-col gap-3">
          {messages.map((message, index) => {
            if (shown < 2 * (index + 1)) return null;
            const mine = message.who === "Danny";
            return (
              <div
                key={index}
                className={`chat-in ${mine ? "self-end text-right" : "self-start"} ${message.emoji ? "" : "max-w-[85%]"}`}
              >
                <div className={`mb-1 text-base font-bold text-teal-soft ${mine ? "mr-2" : "ml-2"}`}>{message.who}</div>
                {message.emoji ? (
                  <div className="px-1.5 text-[2.75rem] leading-[1.1]">{message.text}</div>
                ) : (
                  <div
                    className={`px-5 py-3.5 text-lg leading-[1.45] text-left sm:text-xl ${
                      mine
                        ? "rounded-[1.5rem_1.5rem_0.5rem_1.5rem] bg-teal text-white"
                        : "rounded-[1.5rem_1.5rem_1.5rem_0.5rem] bg-white text-teal"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            );
          })}
          {typing ? (
            <div className={`chat-in ${typing.who === "Danny" ? "self-end" : "self-start"}`}>
              <div className="mx-2 mb-1 text-base font-bold text-teal-soft">{typing.who} is typing</div>
              <div
                aria-hidden="true"
                className={`inline-flex items-center rounded-3xl px-[18px] py-3.5 ${
                  typing.who === "Danny" ? "bg-teal/30" : "bg-white"
                }`}
              >
                <span className="chat-dot" />
                <span className="chat-dot" />
                <span className="chat-dot" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
