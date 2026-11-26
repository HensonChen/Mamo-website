"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";
import type { Variant } from "@/content/variants";

/**
 * "How Mamo works". A 16:9 teal card with two blobs.
 *
 * - No video yet (`src` is null): the card shows a play button and "Demo
 *   video coming soon". Nothing is clickable.
 * - Video set in `siteConfig.demoVideo`: the play button is real. Pressing it
 *   swaps in a native `<video>` with controls and starts it. Nothing is
 *   downloaded before that, so the page stays light.
 */
export function DemoVideo({ demo }: { demo: Variant["demo"] }) {
  const { src, poster, captions } = demo.video;
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hand keyboard focus to the player once it appears, so Space and arrows work at once.
  useEffect(() => {
    if (playing) videoRef.current?.focus();
  }, [playing]);

  return (
    <section id="demo" aria-labelledby="demo-heading" className="pb-16 pt-6 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <SectionHeading id="demo-heading">{demo.heading}</SectionHeading>
        <div className="on-teal relative flex aspect-video items-center justify-center overflow-hidden rounded-[2rem] bg-teal md:rounded-[2.5rem]">
          <div
            aria-hidden="true"
            className="blob-a absolute -bottom-10 -right-8 h-28 w-32 bg-blush md:-bottom-[70px] md:-right-[60px] md:h-[260px] md:w-[280px]"
          />
          <div
            aria-hidden="true"
            className="blob-b absolute -left-8 -top-10 h-24 w-28 bg-sun md:-left-[50px] md:-top-[60px] md:h-[200px] md:w-[220px]"
          />

          {src && playing ? (
            <video
              ref={videoRef}
              className="absolute inset-0 size-full bg-black object-contain"
              controls
              autoPlay
              playsInline
              preload="none"
              poster={poster ?? undefined}
            >
              <source src={src} type="video/mp4" />
              {captions ? <track kind="captions" src={captions} srcLang="en" label="English" default /> : null}
            </video>
          ) : (
            <>
              {src && poster ? (
                <Image src={poster} alt="" fill sizes="(min-width: 1280px) 1184px, 100vw" className="object-cover" />
              ) : null}
              {src ? (
                <button
                  type="button"
                  aria-label="Play the demo video"
                  onClick={() => setPlaying(true)}
                  className="relative flex size-20 items-center justify-center rounded-full bg-sun text-teal transition-colors hover:bg-sun-deep md:size-24"
                >
                  <Icon name="play" className="size-7 md:size-8" />
                </button>
              ) : (
                <div className="relative flex flex-col items-center gap-3 px-6 text-center">
                  <div
                    aria-hidden="true"
                    className="flex size-20 items-center justify-center rounded-full bg-sun text-teal md:size-24"
                  >
                    <Icon name="play" className="size-7 md:size-8" />
                  </div>
                  <p className="text-base font-bold text-white md:text-lg">Demo video coming soon</p>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
