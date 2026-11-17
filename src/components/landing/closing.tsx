import { WrongDoor } from "@/components/landing/wrong-door";
import { Container } from "@/components/ui";
import { WaitlistButton } from "@/components/waitlist-button";
import type { Variant } from "@/content/variants";

/** Last section: the same button again after the questions, so nobody has to scroll back up. */
export function Closing({ variant }: { variant: Variant }) {
  const { closing } = variant;
  return (
    <section
      id="waitlist"
      aria-labelledby="closing-heading"
      className="bg-pine py-[4.5rem] text-center text-paper md:py-28"
    >
      <Container>
        <h2 id="closing-heading" className="mx-auto max-w-[24ch] text-h2 font-bold text-balance text-paper lg:text-h2-lg">
          {closing.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-[50ch] text-xl text-paper/85">{closing.sub}</p>
        <WaitlistButton variant={variant} placement="closing" tone="dark" className="mt-10 items-center" />
        <p className="mx-auto mt-4 max-w-[44ch] text-base text-paper/85">{closing.note}</p>
        <div className="mx-auto mt-7 max-w-xl border-t border-paper/25 pt-5 text-lg text-paper/85">
          <WrongDoor parts={variant.doorLine} />
        </div>
      </Container>
    </section>
  );
}
