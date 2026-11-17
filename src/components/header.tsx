"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { segmentIds, segmentPaths } from "@/content/audiences";
import { Mark } from "@/components/icons";
import { Container } from "@/components/ui";

const segmentPathList: string[] = segmentIds.map((id) => segmentPaths[id]);

/**
 * Logo only. On the three segment pages the logo is plain text, not a link:
 * a paid-ad visitor has one thing to do there, and a way to `/` would only
 * lead away from the form. Everywhere else it links home.
 */
export function Header() {
  const pathname = usePathname();
  const onSegmentPage = segmentPathList.includes(pathname);
  const logo = (
    <>
      <Mark className="size-10" />
      {siteConfig.name}
    </>
  );
  const logoClass = "flex items-center gap-3 rounded-lg text-2xl font-bold tracking-tight text-pine";

  return (
    <header className="relative z-10 bg-transparent">
      <Container className="flex h-[4.5rem] items-center">
        {onSegmentPage ? (
          <span className={logoClass}>{logo}</span>
        ) : (
          <Link href="/" className={logoClass}>
            {logo}
          </Link>
        )}
      </Container>
    </header>
  );
}
