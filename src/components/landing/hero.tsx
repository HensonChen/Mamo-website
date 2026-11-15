import { Icon } from "@/components/icons";
import { WrongDoor } from "@/components/landing/wrong-door";
import { PhoneScreen } from "@/components/phone/screen";
import { Container } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist-form";
import type { Variant } from "@/content/variants";

/**
 * First screen of each segment page: the promise, the price, the signup
 * form, and the demo phone. On a phone the form comes before the demo so
 * the signup is on the first screen; from `lg` the demo sits beside it.
 */
export function Hero({ variant }: { variant: Variant }) {
  const { hero } = variant;
  const single = hero.screens.length === 1;
  // One phone can be larger; two phones share the column.
  // With outcome tiles beside it, the phone stays smaller so the tiles have room.
  const scale = hero.outcomes
    ? "[--s:0.6] lg:[--s:0.62]"
    : single
      ? "[--s:0.6] lg:[--s:0.8]"
      : "[--s:0.6] lg:[--s:0.55]";

  return (
    <section aria-labelledby="hero-heading" className="pb-14 pt-8 sm:pb-20 sm:pt-12">
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-6">
          <h1
            id="hero-heading"
            className="text-display font-bold text-balance text-ink lg:text-display-lg"
          >
            {variant.hero.headline}
          </h1>
          <p className="mt-5 max-w-[34ch] text-xl leading-relaxed text-ink-soft sm:text-2xl">
            {hero.lede}
          </p>
          <ul className="mt-5 space-y-1 text-lg leading-snug text-ink">
            {hero.priceLines.map((line, index) => (
              <li key={line} className={index === 0 ? "text-xl font-bold" : "text-ink-soft"}>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-7 max-w-xl">
            <WaitlistForm
              variant={variant}
              fields={variant.form.heroFields}
              placement="hero"
              heading={variant.form.heading}
              footer={<WrongDoor parts={variant.doorLine} />}
            />
          </div>
        </div>

        {/* min-w-0: a grid item must be allowed to shrink below the width of the swipe row inside it. */}
        <div className="min-w-0 lg:col-span-6">
          <div
            className={`swipe-row flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:justify-center lg:gap-6 lg:overflow-visible ${
              single ? "justify-center" : ""
            } ${hero.outcomes ? "flex-col items-center sm:flex-row sm:justify-center sm:overflow-visible" : ""}`}
            tabIndex={hero.outcomes || single ? undefined : 0}
            role={hero.outcomes || single ? undefined : "group"}
            aria-label={hero.outcomes || single ? undefined : "What FamilyIT looks like. Swipe to see more."}
          >
            {hero.screens.map((screen) => (
              <PhoneScreen
                key={screen}
                id={screen}
                copy={variant.screenCopy}
                className={`snap-center ${scale}`}
              />
            ))}
            {hero.outcomes ? (
              <ul className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-[16rem] sm:self-center">
                {hero.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-3 rounded-[20px] border-2 border-line bg-white p-4 text-xl font-bold leading-snug"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-ok text-white">
                      <Icon name="check" className="size-5" strokeWidth={3} />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
