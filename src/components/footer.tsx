import Link from "next/link";
import { mailHref, siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";
import { Container } from "@/components/ui";

const link = "inline-flex min-h-12 items-center rounded-lg text-base font-bold text-teal-soft hover:text-teal hover:underline hover:decoration-2 hover:underline-offset-4";

export function Footer() {
  // Derived from config rather than the clock so pages prerender fully.
  const year = Number(siteConfig.lastModified.slice(0, 4));
  const founded = Number(siteConfig.foundingYear);
  const years = founded && founded < year ? `${founded}\u2013${year}` : String(year);

  return (
    <footer className="pb-8 pt-6 lg:pb-11 lg:pt-8">
      <Container className="flex flex-col items-start justify-between gap-4 md:flex-row md:flex-wrap md:items-center md:gap-5">
        <Link href="/" aria-label="Mamo home" className="rounded-lg">
          <Logo size="sm" />
        </Link>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-0">
          <Link href="/seniors" className={link}>
            For me
          </Link>
          <Link href="/families" className={link}>
            For a loved one
          </Link>
          <Link href="/privacy" className={link}>
            Privacy
          </Link>
          <Link href="/terms" className={link}>
            Terms
          </Link>
          <a href={mailHref} className={link}>
            Contact
          </a>
        </nav>
        <span className="text-base text-teal-soft">
          &copy; {years} {siteConfig.name}
        </span>
      </Container>
    </footer>
  );
}
