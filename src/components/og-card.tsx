import { siteConfig } from "@/config/site";

/** The helper's face, as inline SVG for Satori. */
function HelperMark({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="50" r="48" fill="#2b5fc4" />
      <rect x="31" y="36" width="12" height="26" rx="6" fill="#fff" />
      <rect x="57" y="36" width="12" height="26" rx="6" fill="#fff" />
    </svg>
  );
}

/**
 * Shared layout for generated Open Graph images (next/og / Satori).
 * Inline styles only; Satori does not read Tailwind classes.
 */
export function OgCard({
  headline,
  kicker,
  cta = "Join the waitlist",
}: {
  headline: string;
  kicker: string;
  cta?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "64px 72px",
        background: "#eef4fc",
        color: "#1b2533",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          paddingRight: 48,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <HelperMark size={64} />
          <div style={{ fontSize: 40, fontWeight: 700 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 28, color: "#4b5768", marginLeft: 12 }}>{kicker}</div>
        </div>

        <div
          style={{
            fontSize: headline.length > 60 ? 58 : 68,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#4b5768",
          }}
        >
          <div>{siteConfig.tagline}</div>
          <div
            style={{
              background: "#2b5fc4",
              color: "#ffffff",
              borderRadius: 20,
              padding: "14px 28px",
              fontWeight: 700,
              flexShrink: 0,
              whiteSpace: "nowrap",
              marginLeft: 24,
            }}
          >
            {cta}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignSelf: "center" }}>
        <HelperMark size={300} />
      </div>
    </div>
  );
}
