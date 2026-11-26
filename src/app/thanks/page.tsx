import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, ButtonLink } from "@/components/ui";
import { LeadPixel } from "@/components/lead-pixel";
import { siteConfig } from "@/config/site";
import { isPageSegmentId, isSegmentId, segmentPaths } from "@/content/audiences";
import { isSubmissionId } from "@/lib/tally";

export const metadata: Metadata = {
  title: "You're on the list",
  robots: { index: false, follow: false },
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** The part that reads the URL: the Lead for a valid submission id, and the way back. */
async function FromTally({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const sid = first(params.sid);
  const seg = first(params.seg);
  // A retired segment (senior-living) has no page, so it goes back to the home page.
  const segment = isSegmentId(seg) ? seg : undefined;
  const back = isPageSegmentId(seg) ? segmentPaths[seg] : "/";
  return (
    <>
      {isSubmissionId(sid) ? <LeadPixel submissionId={sid} segment={segment} /> : null}
      <ButtonLink href={back}>Back to the page</ButtonLink>
    </>
  );
}

/**
 * Where Tally sends people after a real submit:
 * /thanks?sid=<submission id>&seg=<segment>. The email is never in the URL.
 * The Pixel Lead fires only when `sid` looks like a real submission id.
 */
export default function ThanksPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section aria-labelledby="thanks-heading" className="py-16 md:py-24">
      <Container className="max-w-2xl text-center">
        <h1 id="thanks-heading" className="text-display font-bold text-balance text-teal">
          {siteConfig.waitlist.successTitle}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-teal-soft">{siteConfig.waitlist.successBody}</p>
        <div className="mt-8 flex justify-center">
          <Suspense fallback={<ButtonLink href="/">Back to the page</ButtonLink>}>
            <FromTally searchParams={searchParams} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
