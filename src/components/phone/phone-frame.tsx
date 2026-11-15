import type { CSSProperties, ReactNode } from "react";

/** Size of every demo screen, from the WireframeDemoStyled2 artboards. */
export const SCREEN_W = 390;
export const SCREEN_H = 844;

/**
 * A phone with a black bezel, as in the demo's side-by-side artboard.
 *
 * The screen content is always drawn at 390 x 844 and scaled with CSS, so
 * every screen keeps the demo's exact sizes. The scale comes from the
 * `--s` custom property, which callers set with Tailwind classes such as
 * `[--s:0.6] lg:[--s:0.8]`. That keeps the scale responsive without any
 * client-side code.
 */
export function PhoneFrame({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Accessible description of what the screen shows. */
  label: string;
}) {
  const bezel: CSSProperties = {
    padding: "calc(14px * var(--s, 0.6))",
    background: "#111",
    borderRadius: "calc(56px * var(--s, 0.6))",
    boxShadow: "0 24px 48px rgba(27,37,51,0.22), inset 0 0 0 2px #444",
    flexShrink: 0,
  };
  const screen: CSSProperties = {
    position: "relative",
    width: `calc(${SCREEN_W}px * var(--s, 0.6))`,
    height: `calc(${SCREEN_H}px * var(--s, 0.6))`,
    borderRadius: "calc(42px * var(--s, 0.6))",
    overflow: "hidden",
    background: "#fff",
  };
  const canvas: CSSProperties = {
    width: SCREEN_W,
    height: SCREEN_H,
    transform: "scale(var(--s, 0.6))",
    transformOrigin: "0 0",
    position: "absolute",
    top: 0,
    left: 0,
  };
  const notch: CSSProperties = {
    position: "absolute",
    top: "calc(9px * var(--s, 0.6))",
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(96px * var(--s, 0.6))",
    height: "calc(26px * var(--s, 0.6))",
    borderRadius: "calc(13px * var(--s, 0.6))",
    background: "#111",
  };

  return (
    <div role="img" aria-label={label} className={className} style={bezel}>
      <div style={screen}>
        <div aria-hidden="true" style={canvas}>
          {children}
        </div>
        <div aria-hidden="true" style={notch} />
      </div>
    </div>
  );
}
