import Image from "next/image";
import { WaitlistButton } from "@/components/waitlist-button";
import { siteConfig } from "@/config/site";
import type { SegmentId } from "@/content/audiences";

type Pebble = {
  /** Photo in /public. Without one the pebble is a plain color. */
  src?: string;
  /** object-position classes. The face stays in frame when the pebble is small. */
  focus?: string;
  /** Shape class from globals.css. */
  shape: string;
  /**
   * Placement. Below `md` only two pebbles show, tucked into the corners; `md`
   * shows three; `lg` shows all five where the mockup puts them. Widths at `lg`
   * are percentages of the card. Below `lg` the pebbles stay mostly inside the
   * rounded card — a large negative offset gets clipped away by the corner.
   */
  className: string;
};

/** The five pebbles of the hero card, in the mockup's positions. */
const pebbles: Pebble[] = [
  {
    // Pink, no photo.
    shape: "blob-a bg-blush",
    className:
      "block bottom-1 -right-2 w-[18%] aspect-[115/100] md:right-auto md:-bottom-8 md:-left-2 md:w-[24%] lg:block lg:bottom-[97px] lg:left-[-8.5%] lg:aspect-[206/182] lg:w-[16.7%]",
  },
  {
    src: "/images/mamo/photo-couple-tablet.jpg",
    focus: "max-lg:object-[center_40%] lg:object-right",
    shape: "blob-c",
    className:
      "-right-1 -top-1 h-24 w-24 md:block md:-right-2 md:-top-2 md:h-36 md:w-32 lg:right-[-4.1%] lg:top-[-15px] lg:h-auto lg:aspect-[274/265] lg:w-[22.2%]",
  },
  {
    src: "/images/mamo/photo-elder-laptop-couch.jpg",
    shape: "blob-b",
    className:
      "hidden lg:block lg:bottom-[-41px] lg:left-[7.9%] lg:aspect-[227/211] lg:w-[18.4%]",
  },
  {
    src: "/images/mamo/photo-senior-woman-tablet.jpg",
    focus: "max-lg:object-[center_70%] lg:object-bottom",
    shape: "blob-d",
    className:
      "-left-1 -top-1 h-20 w-20 sm:h-24 sm:w-24 md:-left-2 md:-top-2 md:h-36 md:w-32 lg:left-[-4.7%] lg:top-[-30px] lg:h-auto lg:aspect-[283/340] lg:w-[23%]",
  },
  {
    src: "/images/mamo/photo-man-tablet.jpg",
    focus: "max-lg:object-[center_32%]",
    shape: "blob-c",
    className:
      "-bottom-2 left-4 h-26 w-24 md:left-auto lg:left-auto md:bottom-2 md:right-4 md:h-42 md:w-38 lg:bottom-[28px] lg:right-[2.4%] lg:h-auto lg:aspect-[225/251] lg:w-[18.3%]",
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
                sizes="(min-width: 1024px) 280px, 160px"
                className={`object-cover ${pebble.focus ?? "object-center"}`}
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
