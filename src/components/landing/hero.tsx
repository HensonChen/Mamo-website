import Image from "next/image";
import type { CSSProperties } from "react";
import { WaitlistButton } from "@/components/waitlist-button";
import { Container } from "@/components/ui";
import type { Variant } from "@/content/variants";

/**
 * First screen of each segment page: the promise, the price and the one
 * button. From `md` the photo fills the section behind the copy, with a paper
 * colored fade on the left so the words stay readable. On a phone the copy
 * and the button come first and the photo is a rounded picture below them, so
 * the button is on the first screen.
 *
 * The section slides up under the transparent header (negative margin and
 * matching top padding).
 */
export function Hero({ variant }: { variant: Variant }) {
  const { hero } = variant;
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative -mt-[4.5rem] overflow-hidden pt-[4.5rem] md:flex md:min-h-[34rem] md:items-center md:pb-16 md:pt-[8.5rem]"
    >
      <Container className="relative z-10 pb-0 pt-6 md:py-0">
        <div className="md:max-w-[58%]">
          <h1
            id="hero-heading"
            className="max-w-[18ch] text-display font-bold text-balance text-pine lg:text-display-lg"
          >
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-[50ch] text-xl leading-relaxed text-ink-soft sm:text-[1.375rem]">
            {hero.lede}
          </p>
          <div className="mt-5 space-y-1 text-xl font-bold text-pine">
            {hero.priceLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <WaitlistButton variant={variant} placement="hero" className="mt-8" />
        </div>
      </Container>

      <div
        className="relative mx-5 mb-12 mt-10 aspect-[4/3] overflow-hidden rounded-3xl sm:mx-10 md:absolute md:inset-0 md:mx-0 md:my-0 md:aspect-auto md:rounded-none"
        style={
          {
            "--pos-m": hero.image.mobilePosition,
            "--pos-d": hero.image.position,
          } as CSSProperties
        }
      >
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="(min-width: 768px) 100vw, 90vw"
          className="object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos-d)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-linear-to-r from-paper from-0% via-paper/95 via-55% to-paper/0 to-80% md:block"
        />
      </div>
    </section>
  );
}
