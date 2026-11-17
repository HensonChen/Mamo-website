import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Page gutter and max width. */
export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-10 ${className}`}>{children}</div>
  );
}

type ButtonVariant = "primary" | "secondary";

const buttonBase =
  "inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-xl font-bold transition-colors duration-150";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-plum text-white hover:bg-plum-deep",
  secondary: "border-2 border-edge bg-white text-ink hover:bg-chip",
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
      className={`font-bold text-link underline decoration-2 underline-offset-4 hover:text-plum ${className}`}
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
