import { PhoneScreen } from "@/components/phone/screen";
import { Container } from "@/components/ui";
import type { Variant } from "@/content/variants";

/**
 * Four still screens from the demo, in order. Swipeable on a phone, a row on
 * a wide screen. Nothing moves, so the order is the story.
 */
export function Storyboard({ variant }: { variant: Variant }) {
  const { storyboard } = variant;
  return (
    <section aria-labelledby="storyboard-heading" className="bg-white py-14 sm:py-20">
      <Container>
        <h2 id="storyboard-heading" className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {storyboard.heading}
        </h2>
        <p className="mt-2 text-lg text-ink-soft sm:hidden">Swipe to see each step.</p>
        <ol
          className="swipe-row -mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible"
          tabIndex={0}
          aria-label={`${storyboard.heading}: ${storyboard.steps.length} steps`}
        >
          {storyboard.steps.map((step, index) => (
            <li
              key={`${step.screen}-${index}`}
              className="flex shrink-0 snap-center flex-col items-center gap-4 lg:shrink"
            >
              <PhoneScreen
                id={step.screen}
                copy={variant.screenCopy}
                className="[--s:0.6]"
              />
              <p className="flex max-w-[15.5rem] items-start gap-3 text-xl font-bold leading-snug text-ink">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-azure text-lg text-white"
                >
                  {index + 1}
                </span>
                <span>{step.caption}</span>
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
