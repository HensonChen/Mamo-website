import Link from "next/link";
import { mailHref, siteConfig } from "@/config/site";
import { Mark } from "@/components/icons";
import { Container } from "@/components/ui";

export function Footer() {
  // Derived from config rather than the clock so pages prerender fully.
  const year = Number(siteConfig.lastModified.slice(0, 4));
  const founded = Number(siteConfig.foundingYear);
  const years = founded && founded < year ? `${founded} to ${year}` : String(year);
  const link = "text-ink-soft underline decoration-2 underline-offset-4 hover:text-azure-deep";

  return (
    <footer className="border-t-2 border-line/70 bg-white">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-3 text-2xl font-bold tracking-tight text-ink">
            <Mark className="size-10" />
            {siteConfig.name}
          </p>
          <p className="mt-3 max-w-sm text-lg leading-relaxed text-ink-soft">
            {siteConfig.tagline}. {siteConfig.product.launchWindow}.
          </p>
        </div>
        <nav aria-label="Footer" className="text-lg">
          <ul className="space-y-2">
            <li>
              <a href={mailHref} className="font-bold text-azure-deep underline decoration-2 underline-offset-4 hover:text-azure">
                {siteConfig.contactEmail}
              </a>
            </li>
            <li>
              <Link href="/privacy" className={link}>
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={link}>
                Terms of service
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
      <Container className="border-t-2 border-chip py-5 text-base text-ink-soft">
        &copy; {years} {siteConfig.legalName}. All rights reserved.
      </Container>
    </footer>
  );
}
