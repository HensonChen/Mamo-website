import Image from "next/image";
import { WaitlistButton } from "@/components/waitlist-button";
import { siteConfig } from "@/config/site";
import type { SegmentId } from "@/content/audiences";

type Pebble = {
  /** Photo in /public. Without one the pebble is a plain color. */
  src?: string;
  /** CSS object-position for the photo. */
  position?: string;
  /** Shape class from globals.css. */
  shape: string;
  /**
   * Placement. Below `md` only two pebbles show, tucked into the corners; `md`
   * shows three; `lg` shows all five where the mockup puts them. Widths are
   * percentages of the card so the layout scales with it.
   */
  className: string;
};

/** The five pebbles of the hero card, in the mockup's positions. */
const pebbles: Pebble[] = [
  {
    // Pink, no photo.
    shape: "blob-a bg-blush",
    className:
      "hidden lg:block lg:bottom-[97px] lg:left-[-8.5%] lg:aspect-[206/182] lg:w-[16.7%]",
  },
  {
    src: "/images/mamo/photo-couple-tablet.jpg",
    position: "right",
    shape: "blob-c",
    className:
      "hidden md:block md:-right-10 md:-top-10 md:h-40 md:w-44 lg:right-[-4.1%] lg:top-[-15px] lg:h-auto lg:aspect-[274/265] lg:w-[22.2%]",
  },
  {
    src: "/images/mamo/photo-elder-laptop-couch.jpg",
    position: "center",
    shape: "blob-b",
    className:
      "hidden lg:block lg:bottom-[-41px] lg:left-[7.9%] lg:aspect-[227/211] lg:w-[18.4%]",
  },
  {
    src: "/images/mamo/photo-senior-woman-tablet.jpg",
    position: "bottom",
    shape: "blob-d",
    className:
      "-left-8 -top-8 h-28 w-24 md:-left-10 md:-top-10 md:h-44 md:w-36 lg:left-[-4.7%] lg:top-[-30px] lg:h-auto lg:aspect-[283/340] lg:w-[23%]",
  },
  {
    src: "/images/mamo/photo-man-tablet.jpg",
    position: "center",
    shape: "blob-c",
    className:
      "-bottom-10 -right-8 h-28 w-24 md:-right-6 md:h-44 md:w-40 lg:bottom-[28px] lg:right-[2.4%] lg:h-auto lg:aspect-[225/251] lg:w-[18.3%]",
  },
];

/**
 * First screen of each page: a teal card with the promise, the one button and
 * photo "pebbles" around the edges. The pebbles are decoration (empty alt),
 * kept clear of the words by scaling with the card and by dropping from five
 * to three to two as the screen narrows.
 */
export function Hero({
  heading,
  lede,
  segment,
}: {
  heading: string;
  lede: string;
  /** Which Tally form the button opens. */
  segment: SegmentId;
}) {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto w-full max-w-[80rem] px-3 pt-1 sm:px-6 sm:pt-2">
      <div className="on-teal relative flex min-h-[30rem] items-center justify-center overflow-hidden rounded-[2rem] bg-teal px-6 py-24 sm:rounded-[2.5rem] md:min-h-[36rem] md:px-12 md:py-28 lg:min-h-[38.75rem]">
        {pebbles.map((pebble, index) => (
          <div
            key={index}
            aria-hidden="true"
            className={`absolute overflow-hidden ${pebble.shape} ${pebble.className}`}
          >
            {pebble.src ? (
              <Image
                src={pebble.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 280px, 180px"
                className="object-cover"
                style={{ objectPosition: pebble.position }}
              />
            ) : null}
          </div>
        ))}

        <div className="relative z-10 flex max-w-[42.5rem] flex-col lg:max-w-[36rem] xl:max-w-[42.5rem] items-center gap-5 text-center lg:gap-[22px]">
          <h1
            id="hero-heading"
            className="text-display font-bold text-white lg:text-[3.5rem] lg:leading-[1.02] lg:tracking-[-0.03em] xl:text-display-lg"
          >
            {heading}
          </h1>
          <p className="max-w-[38.75rem] text-lg leading-normal text-white/85 sm:text-xl">{lede}</p>
          <WaitlistButton segment={segment} placement="hero" tone="sun" className="mt-1" />
          <p className="text-sm text-white/85">{siteConfig.product.heroNote}</p>
        </div>
      </div>
    </section>
  );
}
