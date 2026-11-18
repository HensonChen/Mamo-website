import type { ReactNode, SVGProps } from "react";

/** Minimal inline icons. Decorative unless a `title` is given. */
export type IconName =
  | "chevron"
  | "check"
  | "mail"
  | "menu"
  | "close"
  | "lock"
  | "mic"
  | "clock"
  | "sliders"
  | "building"
  | "people"
  | "card"
  | "help";

const paths: Record<IconName, ReactNode> = {
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V8l8-5 8 5v13M2 21h20" />
      <path d="M9 21v-6h6v6M9 11h.01M15 11h.01" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14a5 5 0 0 1 4.5 5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M12 17h.01" />
    </>
  ),
};

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; title?: string };

export function Icon({ name, title, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      className={className ?? "size-6"}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}

/**
 * Brand mark: three overlapping circles (family, helper, you), from the
 * landing mockup.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className ?? "size-10"}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <circle cx="74" cy="124" r="68" fill="#c9d6cb" />
      <circle cx="134" cy="112" r="56" fill="#244b43" stroke="#fbfaf7" strokeWidth="5" />
      <circle cx="104" cy="62" r="34" fill="#7c3c5c" stroke="#fbfaf7" strokeWidth="5" />
    </svg>
  );
}
