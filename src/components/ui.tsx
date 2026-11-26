import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Page gutter and max width. Content is 1184px wide on a large screen, as in the mockups. */
export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[80rem] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
  );
}

/** Centered section heading used by every section in the mockups. */
export function SectionHeading({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`mx-auto mb-8 max-w-[47.5rem] text-center text-h2 font-bold text-balance text-teal lg:mb-10 lg:text-h2-lg ${className}`}
    >
      {children}
    </h2>
  );
}

type ButtonVariant = "primary" | "secondary" | "sun";

const buttonBase =
  "inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-lg font-bold transition-colors duration-150";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-teal text-white hover:bg-teal-soft",
  secondary: "border-2 border-teal bg-white text-teal hover:bg-sand",
  sun: "bg-sun text-teal hover:bg-sun-deep",
};

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** A link styled as a button. Works without JavaScript. */
export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

/** Inline text link with a clear underline. */
export function TextLink({ className = "", children, ...rest }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`font-bold text-teal underline decoration-2 underline-offset-4 hover:text-teal-soft ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Body paragraphs with a comfortable measure. */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[62ch] space-y-5 text-lg leading-relaxed sm:text-xl ${className}`}>
      {children}
    </div>
  );
}
