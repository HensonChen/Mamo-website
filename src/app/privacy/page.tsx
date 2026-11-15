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
          {siteConfig.legalName} (&ldquo;{siteConfig.name}&rdquo;, &ldquo;we&rdquo;) is building a
          voice and screen tech helper for older adults, their families and senior living
          communities. You can reach us at{" "}
          {siteConfig.contactEmail}.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            When you join the waitlist: your email address, which page you used, and the optional
            details on that page&apos;s form (such as who it is for, a community name, or your role).
          </li>
          <li>The page you signed up from and the time you signed up.</li>
          <li>Anything you choose to tell us when you email us.</li>
        </ul>
        <p>
          If you arrive from one of our ads on Facebook or Instagram, we also keep a small cookie
          on our own site that records which ad you came from, for up to 30 days, so we can tell
          which ads lead to signups.
        </p>
      </section>

      <section>
        <h2>Advertising and Meta</h2>
        <p>
          We advertise on Facebook and Instagram (Meta). To measure whether our ads work, this
          site uses the Meta Pixel in your browser. When you join the waitlist, our server also
          sends Meta a record of that signup through the Meta Conversions API. That record
          includes a hashed (scrambled, not readable) version of your email address, a hashed
          internal ID, the page you signed up from, your IP address and browser type, and Meta&apos;s
          own advertising cookies if you have them. Meta uses it to match the signup to an ad and
          to show our ads to people like you. Meta&apos;s use of the data is covered by its own
          privacy policy. You can turn off ad personalization in your Facebook and Instagram
          settings, or block the Pixel in your browser, and you can still join the waitlist.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <p>
          To tell you about FamilyIT, invite you to early access, and shape what we build around
          the people on the list. We do not sell your information or share it with third parties
          for their own marketing.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Until you ask us to remove you, or until the waitlist closes and we have either invited
          you or deleted the list. Every email we send includes a way to leave the list.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the information we hold about you at any time.
          Email {siteConfig.contactEmail} and we will respond within 30 days.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          When this policy changes we will update the date at the top of the page and, for
          significant changes, email the waitlist.
        </p>
      </section>
    </LegalPage>
  );
}
