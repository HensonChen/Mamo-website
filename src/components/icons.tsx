import type { ReactNode, SVGProps } from "react";

/** Minimal inline icons, drawn as in the mockups. Decorative unless a `title` is given. */
export type IconName = "check" | "setup" | "pointer" | "mic" | "shield" | "people" | "history" | "play";

const paths: Record<IconName, ReactNode> = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  setup: (
    <>
      <rect x="3" y="4.5" width="18" height="12" rx="2.5" />
      <path d="M8.5 20h7" />
      <path d="M12 16.5V20" />
      <path d="M9 10.5l2 2 4-4" />
    </>
  ),
  pointer: (
    <>
      <path d="M9 3.5v2" />
      <path d="M4.5 9H2.5" />
      <path d="M5.6 5.6L4.2 4.2" />
      <path d="M9.5 9.5l10 4-4.2 1.7-1.7 4.3z" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5v3.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5l7.5 3v6c0 4.6-3.2 8.4-7.5 10-4.3-1.6-7.5-5.4-7.5-10v-6z" />
      <path d="M8.8 12l2.2 2.2 4.2-4.4" />
    </>
  ),
  people: (
    <>
      <circle cx="8.5" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M3 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <path d="M14.5 14.6c.6-.2 1.3-.3 2-.3 2.3 0 4 1.5 4.5 4.2" />
    </>
  ),
  history: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
      <path d="M3.5 4v4.5H8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
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

/** The Mamo blob face path, shared with the Open Graph card. */
export const MARK_PATH =
  "M65.91 51.2 C88.76 38.63 126.28 41.91 138 44 C165.64 48.92 184 70 180 106 C176 142 150 166 112 168 C78 170 39.87 162.06 26 132 C14 106 25.91 73.2 65.91 51.2 Z";

/** The blob face. `fill` is the blob, `face` the eyes and smile. */
export function Mark({
  className,
  title,
  fill = "#113C42",
  face = "#FFFFFF",
}: {
  className?: string;
  title?: string;
  fill?: string;
  face?: string;
}) {
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
      <path d={MARK_PATH} fill={fill} />
      <circle cx="86" cy="104" r="7" fill={face} />
      <circle cx="126" cy="100" r="7.5" fill={face} />
      <path d="M90 126 Q110 141 130 122" fill="none" stroke={face} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** The logo lockup: blob face and the lowercase "mamo" wordmark. */
export function Logo({ size = "lg", className = "" }: { size?: "lg" | "sm"; className?: string }) {
  const big = size === "lg";
  return (
    <span
      className={`inline-flex items-center font-bold tracking-[-0.04em] text-teal ${
        big ? "gap-1.5 text-[1.75rem] sm:text-[2.125rem]" : "gap-1.5 text-[1.625rem]"
      } ${className}`}
    >
      <Mark className={big ? "size-9 sm:size-[2.875rem]" : "size-9"} />
      <span>mamo</span>
    </span>
  );
}
