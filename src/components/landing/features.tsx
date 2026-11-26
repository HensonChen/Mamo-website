import { Icon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";
import type { Variant } from "@/content/variants";

/** "Everything Mamo can do": six icon cards. 3 columns from `lg`, 2 from `sm`, 1 on a small phone. */
export function Features({ features }: { features: Variant["features"] }) {
  return (
    <section aria-labelledby="features-heading" className="pb-16 pt-6 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <SectionHeading id="features-heading">{features.heading}</SectionHeading>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
          {features.items.map((item) => (
            <li key={item.title} className="flex flex-col gap-3">
              <div
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-3xl bg-sun text-teal"
              >
                <Icon name={item.icon} className="size-[2.125rem]" />
              </div>
              <h3 className="mt-1.5 text-h3 font-bold text-teal lg:text-h3-lg">{item.title}</h3>
              <p className="text-lg leading-relaxed text-teal-soft md:text-xl md:leading-[1.55]">{item.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
