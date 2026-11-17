import type { Metadata } from "next";
import { PhoneScreen } from "@/components/phone/screen";
import { Container } from "@/components/ui";
import { doors, variants } from "@/content/variants";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * `/` is a one-screen chooser for organic and direct visitors. Paid ads never
 * open it, and it has no form, so nothing signed up here can be counted as an
 * ad result. Each door goes to the page and form that fit the visitor.
 */
export default function HomePage() {
  const { screenCopy } = variants.families;
  return (
    <section aria-labelledby="home-heading" className="py-10 sm:py-14 lg:py-20">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-6">
          <h1 id="home-heading" className="text-display font-bold text-balance text-pine lg:text-display-lg">
            Tech help your parent can just talk to
          </h1>
          <p className="mt-5 max-w-[34ch] text-xl leading-relaxed text-ink-soft sm:text-2xl">
            Who is FamilyIT for?
          </p>
          <ul className="mt-7 flex max-w-xl flex-col gap-4">
            {doors.map((door) => (
              <li key={door.href}>
                <Link
                  href={door.href}
                  className="flex min-h-20 flex-col justify-center rounded-2xl border-2 border-line bg-white px-6 py-4 transition-colors hover:border-pine hover:bg-sage"
                >
                  <span className="text-xl font-bold text-pine">
                    Join the waitlist: {door.label}
                  </span>
                  <span className="text-lg text-ink-soft">{door.sub}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          {/* Two phones side by side must fit a 390px screen, so they are small there. */}
          <div className="flex justify-center gap-4 lg:gap-6">
            <PhoneScreen id="home" copy={screenCopy} className="[--s:0.32] min-[360px]:[--s:0.38] sm:[--s:0.6] lg:[--s:0.5] xl:[--s:0.62]" />
            <PhoneScreen id="notice-done" copy={screenCopy} className="[--s:0.32] min-[360px]:[--s:0.38] sm:[--s:0.6] lg:[--s:0.5] xl:[--s:0.62]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
