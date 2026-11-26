import Image from "next/image";
import { Blob } from "@/components/landing/blob";
import { Container, SectionHeading } from "@/components/ui";
import type { Variant } from "@/content/variants";

/**
 * Three sketches with a title and a line each. Three columns from `lg`; on a
 * tablet each row is picture-left, words-right (three narrow columns would
 * crush the text); on a phone they stack.
 */
export function Benefits({ benefits }: { benefits: Variant["benefits"] }) {
  return (
    <section aria-labelledby="benefits-heading" className="pb-16 pt-6 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <SectionHeading id="benefits-heading" className="max-w-[56.25rem]">
          {benefits.heading}
        </SectionHeading>
        <ul className="grid gap-12 lg:grid-cols-3 lg:gap-12">
          {benefits.items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10 lg:flex-col lg:items-stretch lg:gap-4"
            >
              <div className="relative flex aspect-[4/3] w-full shrink-0 items-center justify-center md:w-[45%] lg:w-full">
                <Blob spec={item.blob} />
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 90vw"
                  className="relative block h-auto"
                  style={{ width: `${item.image.widthPercent}%` }}
                />
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <h3 className="text-h3 font-bold text-teal lg:text-h3-lg">{item.title}</h3>
                <p className="text-lg leading-relaxed text-teal-soft md:text-xl md:leading-[1.55]">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
