import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, ButtonLink } from "@/components/ui";
import { LeadPixel } from "@/components/lead-pixel";
import { SurveyEmbed } from "@/components/survey-embed";
import { siteConfig } from "@/config/site";
import { isPageSegmentId, isSegmentId, segmentPaths } from "@/content/audiences";
import { hasSurveyForm, isSubmissionId, surveyEmbedUrl, surveyFormId } from "@/lib/tally";

export const metadata: Metadata = {
  title: "You're on the list",
  robots: { index: false, follow: false },
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const bodyClass = "mx-auto mt-5 max-w-2xl text-xl leading-relaxed text-teal-soft";

/**
 * Confirmation, the survey, and the way back. While a survey is showing,
 * the way back appears only after that form is submitted.
 */
function FollowUp({
  body,
  back,
  embedSrc,
  formId,
  showBack = true,
}: {
  body: string;
  back: string;
  embedSrc?: string;
  formId?: string;
  /** False in the loading shell when a survey may replace this, so the link does not flash. */
  showBack?: boolean;
}) {
  return (
    <>
      <p className={bodyClass}>{body}</p>
      {embedSrc && formId ? <SurveyEmbed src={embedSrc} formId={formId} back={back} /> : null}
      {showBack && !embedSrc ? (
        <div className="mt-8 flex justify-center">
          <ButtonLink href={back}>Back to the page</ButtonLink>
        </div>
      ) : null}
    </>
  );
}

/** The part that reads the URL: the Lead for a valid submission id, the survey, and the way back. */
async function FromTally({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const sid = first(params.sid);
  const seg = first(params.seg);
  // A retired segment (senior-living) has no page, so it goes back to the home page.
  const segment = isSegmentId(seg) ? seg : undefined;
  const back = isPageSegmentId(seg) ? segmentPaths[seg] : "/";
  const formId = surveyFormId(segment);
  const embedSrc = isSubmissionId(sid) && formId ? surveyEmbedUrl(sid, segment) : undefined;
  return (
    <>
      {isSubmissionId(sid) ? <LeadPixel submissionId={sid} segment={segment} /> : null}
      <FollowUp
        body={embedSrc ? siteConfig.waitlist.tally.survey.prompt : siteConfig.waitlist.successBody}
        back={back}
        embedSrc={embedSrc}
        formId={formId}
      />
    </>
  );
}

/**
 * Where Tally sends people after a real submit:
 * /thanks?sid=<submission id>&seg=<segment>. The email is never in the URL.
 * The Pixel Lead fires only when `sid` looks like a real submission id.
 * The follow-up survey embeds on this same page, and only for that same id.
 */
export default function ThanksPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section aria-labelledby="thanks-heading" className="py-16 md:py-24">
      <Container className="max-w-3xl text-center">
        <h1 id="thanks-heading" className="text-display font-bold text-balance text-teal">
          {siteConfig.waitlist.successTitle}
        </h1>
        <Suspense
          fallback={
            <FollowUp
              body={
                hasSurveyForm()
                  ? siteConfig.waitlist.tally.survey.prompt
                  : siteConfig.waitlist.successBody
              }
              back="/"
              showBack={!hasSurveyForm()}
            />
          }
        >
          <FromTally searchParams={searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}
