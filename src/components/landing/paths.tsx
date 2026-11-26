import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { home } from "@/content/home";

/** "Who is Mamo for?": two cards that send the visitor to the page that fits. */
export function Paths() {
  const { paths } = home;
  return (
    <section id="paths" aria-labelledby="paths-heading" className="pb-16 pt-4 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <SectionHeading id="paths-heading">{paths.heading}</SectionHeading>
        <ul className="grid gap-6 md:grid-cols-2">
          {paths.cards.map((card) => (
            <li key={card.href} className="flex">
              <Link
                href={card.href}
                className="flex w-full flex-col gap-3.5 rounded-[2rem] bg-white p-6 text-teal transition-shadow hover:shadow-lg sm:p-8 lg:p-11"
              >
                <span className="text-h3 font-bold tracking-[-0.02em] lg:text-h3-lg">{card.title}</span>
                <span className="text-lg leading-[1.55] text-teal-soft sm:text-xl">{card.body}</span>
                <span className="mt-3.5 inline-flex min-h-12 items-center self-start rounded-full bg-teal px-6 py-2 text-base font-bold text-white">
                  {card.cta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-9 text-center text-lg text-teal sm:text-xl">
          <strong>{paths.priceLine}</strong>
          <span className="text-teal-soft">{paths.priceDetail}</span>
        </p>
      </Container>
    </section>
  );
}
