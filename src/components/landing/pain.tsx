import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui";
import { home } from "@/content/home";

/** Per-card blob and drawing placement, in percentages of the 4:3 picture box. */
const art = {
  danny: {
    blob: "blob-e bg-blush",
    style: { left: "50%", top: "41%", width: "49%", height: "60%", transform: "translateX(-50%) rotate(-6deg)" },
    imageWidth: "48%",
  },
  mom: {
    blob: "blob-f bg-sun",
    style: { left: "50%", top: "37%", width: "51%", height: "58%", transform: "translateX(-50%) rotate(7deg)" },
    imageWidth: "58%",
  },
} as const;

/** "Tech help shouldn't be so hard": the two voices, side by side from `md`. */
export function Pain() {
  const { pain } = home;
  return (
    <section aria-labelledby="pain-heading" className="pb-16 pt-4 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <SectionHeading id="pain-heading">{pain.heading}</SectionHeading>
        <ul className="grid gap-12 md:grid-cols-2 md:gap-6">
          {pain.cards.map((card) => {
            const { blob, style, imageWidth } = art[card.blob];
            return (
              <li key={card.quote} className="flex flex-col gap-3.5">
                <div className="relative flex aspect-[4/3] items-end justify-center overflow-hidden">
                  <div aria-hidden="true" className={`absolute ${blob}`} style={style} />
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    width={card.image.width}
                    height={card.image.height}
                    sizes="(min-width: 768px) 280px, 70vw"
                    className="relative block h-auto"
                    style={{ width: imageWidth }}
                  />
                </div>
                <p className="mx-1 mt-2.5 text-xl font-bold leading-snug text-teal md:mx-3.5 md:text-[1.625rem]">
                  {card.quote}
                </p>
                <p className="mx-1 text-lg leading-relaxed text-teal-soft md:mx-3.5 md:text-xl md:leading-[1.6]">
                  {card.body}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
