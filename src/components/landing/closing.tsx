import { WaitlistButton } from "@/components/waitlist-button";
import { siteConfig } from "@/config/site";
import type { SegmentId } from "@/content/audiences";

/** Last section: the teal band with the button again, so nobody has to scroll back up. */
export function Closing({
  heading,
  sub,
  segment,
}: {
  heading: string;
  sub: string;
  /** Which Tally form the button opens. */
  segment: SegmentId;
}) {
  return (
    <section
      aria-labelledby="closing-heading"
      className="mx-auto w-full max-w-[80rem] px-3 pb-8 sm:px-6 lg:pb-12"
    >
      <div
        id="waitlist"
        className="on-teal relative flex flex-col items-center gap-[18px] overflow-hidden rounded-[2rem] bg-teal px-6 py-20 text-center sm:rounded-[2.5rem] md:px-12 md:py-[6.5rem]"
      >
        <div
          aria-hidden="true"
          className="blob-b absolute -bottom-10 -left-8 h-28 w-32 bg-blush md:-bottom-[60px] md:-left-[50px] md:h-[220px] md:w-[240px]"
        />
        <div
          aria-hidden="true"
          className="blob-a absolute -right-6 -top-8 h-24 w-28 bg-sun md:-right-10 md:-top-[50px] md:h-[190px] md:w-[200px]"
        />
        <h2
          id="closing-heading"
          className="relative max-w-[22ch] text-h2 font-bold text-balance text-white lg:text-h2-lg"
        >
          {heading}
        </h2>
        <p className="relative max-w-[40rem] text-lg text-balance text-white/85 sm:text-xl">{sub}</p>
        <WaitlistButton segment={segment} placement="closing" tone="sun" className="relative mt-2" />
        <p className="relative max-w-[28rem] text-sm text-white/70">{siteConfig.waitlist.privacyNote}</p>
      </div>
    </section>
  );
}
