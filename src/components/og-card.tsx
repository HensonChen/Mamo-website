import { siteConfig } from "@/config/site";

/** The three-circle mark, as inline SVG for Satori. */
function HelperMark({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <circle cx="74" cy="124" r="68" fill="#c9d6cb" />
      <circle cx="134" cy="112" r="56" fill="#244b43" stroke="#fbfaf7" strokeWidth="5" />
      <circle cx="104" cy="62" r="34" fill="#7c3c5c" stroke="#fbfaf7" strokeWidth="5" />
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
        background: "#fbfaf7",
        color: "#244b43",
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
          <div style={{ fontSize: 28, color: "#4c5a57", marginLeft: 12 }}>{kicker}</div>
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
            color: "#4c5a57",
          }}
        >
          <div>{siteConfig.tagline}</div>
          <div
            style={{
              background: "#7c3c5c",
              color: "#ffffff",
              borderRadius: 999,
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
