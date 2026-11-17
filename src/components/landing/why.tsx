import { Container } from "@/components/ui";
import type { Variant } from "@/content/variants";

/** The slogan and three numbered points. Three columns from `md`, stacked on a phone. */
export function Why({ variant }: { variant: Variant }) {
  const { why } = variant;
  return (
    <section id="why" aria-labelledby="why-heading" className="bg-sage py-[4.5rem] md:py-28">
      <Container>
        <h2
          id="why-heading"
          className="max-w-[22ch] text-h2 font-bold text-balance text-pine lg:text-h2-lg"
        >
          {why.slogan}
        </h2>
        <ol className="mt-12 grid gap-10 md:mt-14 md:grid-cols-3">
          {why.points.map((point, index) => (
            <li key={point}>
              <div className="flex items-center gap-4" aria-hidden="true">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-pine text-xl font-bold leading-none text-pine">
                  {index + 1}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-6 max-w-[16ch] text-2xl font-bold leading-snug text-balance text-pine">
                {point}
              </h3>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
