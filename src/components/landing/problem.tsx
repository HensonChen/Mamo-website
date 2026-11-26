import Image from "next/image";
import { Blob } from "@/components/landing/blob";
import { Container, SectionHeading } from "@/components/ui";
import type { Variant } from "@/content/variants";

/**
 * The persona story: Margaret on "For me", Danny on "For a loved one". The
 * drawing sits beside the words from `md` and above them on a phone.
 */
export function Problem({ problem }: { problem: Variant["problem"] }) {
  const { image } = problem;
  return (
    <section id="problem" aria-labelledby="problem-heading" className="py-14 md:py-20 lg:py-[6.25rem]">
      <Container>
        <SectionHeading id="problem-heading">{problem.heading}</SectionHeading>
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="relative flex h-[18rem] w-full max-w-[27.5rem] items-end justify-center overflow-hidden md:h-[20rem] md:flex-[0_1_20rem] lg:h-[24.5rem] lg:flex-[0_1_27.5rem]">
            <Blob spec={problem.blob} centered />
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 768px) 440px, 90vw"
              className="relative block h-auto"
              style={{ width: `${image.widthPercent}%`, maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
          <div className="flex w-full max-w-[31.25rem] flex-col gap-4 md:flex-1">
            <p className="text-xl font-bold leading-snug text-teal md:text-[1.625rem]">{problem.lead}</p>
            <p className="text-lg leading-relaxed text-teal-soft md:text-xl md:leading-[1.6]">{problem.body}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
