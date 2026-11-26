"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons";
import { Container } from "@/components/ui";
import { WaitlistButton } from "@/components/waitlist-button";
import { pageSegmentIds, segmentPaths, type SegmentId } from "@/content/audiences";
import { hasSurveyForm } from "@/lib/tally";

const navLink =
  "inline-flex min-h-12 items-center rounded-lg text-base font-bold text-teal hover:underline hover:decoration-2 hover:underline-offset-4";

/**
 * Same on every page, as in the mockups: "For me" and "For a loved one" on the
 * left, the logo (a link home) in the middle, and the waitlist button on the right.
 *
 * Below `md` the logo and button share the first row, and the two links sit
 * centered under them, so every link stays visible without a menu.
 *
 * The button opens the Tally form of the page you are on. Pages without an
 * audience (the home page, privacy, terms) use the families form. On /thanks,
 * once either survey URL is set, the button is hidden so the survey is the next step.
 */
export function Header() {
  const pathname = usePathname();
  const segment: SegmentId = pageSegmentIds.find((id) => segmentPaths[id] === pathname) ?? "families";
  // On the thank-you page the survey is the next step. The waitlist button would
  // send someone who just signed up back into the form.
  const hideWaitlist = pathname === "/thanks" && hasSurveyForm();

  return (
    <header className="relative z-10">
      <Container className="grid grid-cols-[1fr_auto] items-center gap-x-4 py-3 md:grid-cols-3 md:py-5">
        <nav
          aria-label="Main"
          className="order-3 col-span-2 flex justify-center gap-6 md:order-1 md:col-span-1 md:justify-start"
        >
          <Link href="/seniors" className={navLink}>
            For me
          </Link>
          <Link href="/families" className={navLink}>
            For a loved one
          </Link>
        </nav>
        <Link
          href="/"
          aria-label="Mamo home"
          className="order-1 justify-self-start rounded-lg md:order-2 md:justify-self-center"
        >
          <Logo />
        </Link>
        <div className="order-2 justify-self-end md:order-3">
          {hideWaitlist ? null : <WaitlistButton segment={segment} placement="header" size="sm" />}
        </div>
      </Container>
    </header>
  );
}
