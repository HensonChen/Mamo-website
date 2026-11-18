import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${siteConfig.name} handles the information you share when you join the waitlist or contact us.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated={siteConfig.lastModified}>
      <section>
        <h2>Who we are</h2>
        <p>
          {siteConfig.legalName} (&ldquo;{siteConfig.name}&rdquo;,
          &ldquo;we&rdquo;) is building a voice and screen tech helper for older
          adults, their families and senior living communities. You can reach us
          at {siteConfig.contactEmail}.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            When you join the waitlist: the answers you give in the sign-up
            form, which include your email address. The form is run by Tally
            (tally.so), not by this website, and Tally collects and stores your
            answers. See{" "}
            <a
              href="https://tally.so/privacy-policy"
              className="font-bold text-link underline decoration-2 underline-offset-4"
            >
              Tally&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            Which of our pages you signed up from, and the time you signed up.
          </li>
          <li>Anything you choose to tell us when you email us.</li>
        </ul>
        <p>
          This website does not collect your email address itself. The button on
          our pages opens the Tally form on tally.so. When you click it we pass
          along which page you were on, and, if you came from one of our ads,
          two Meta identifiers and a random click ID described below.
        </p>
        <p>
          If you arrive from one of our ads on Facebook or Instagram, we also
          keep a small cookie on our own site that records which ad you came
          from, for up to 30 days, so we can tell which ads lead to signups.
        </p>
      </section>

      <section>
        <h2>Advertising and Meta</h2>
        <p>
          We advertise on Facebook and Instagram (Meta). To measure whether our
          ads work, this site uses the Meta Pixel in your browser, which reports
          that you viewed a page.
        </p>
        <p>
          When you submit the sign-up form, the email you gave and the ad-click
          ID are sent to Meta. Two things send it: the thank-you page you land
          on after submitting, through the Meta Pixel in your browser, and our
          server, through the Meta Conversions API. The server sends a hashed
          (scrambled, not readable) version of your email address, the ad-click
          identifier (&ldquo;fbc&rdquo;) and Meta&apos;s browser identifier
          (&ldquo;fbp&rdquo;) if you have them, a hashed random click ID, the
          page the signup is for, and the ID of your form submission. It does
          not send your IP address or browser type from the server. Meta uses
          this to match the signup to an ad and to show our ads to people like
          you. Meta&apos;s use of the data is covered by its own privacy policy.
          You can turn off ad personalization in your Facebook and Instagram
          settings, or block the Pixel in your browser, and you can still join
          the waitlist.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <p>
          To tell you about FamilyIT, invite you to early access, and shape what
          we build around the people on the list. We do not sell your
          information. Apart from the signup report to Meta described above, we
          do not share it with third parties for their own marketing.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Until you ask us to remove you, or until the waitlist closes and we
          have either invited you or deleted the list. Every email we send
          includes a way to leave the list.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the information we hold about
          you at any time. Email {siteConfig.contactEmail} and we will respond
          within 30 days.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          When this policy changes we will update the date at the top of the
          page and, for significant changes, email the waitlist.
        </p>
      </section>
    </LegalPage>
  );
}
