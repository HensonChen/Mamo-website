import { siteConfig } from "@/config/site";
import { MARK_PATH } from "@/components/icons";

/** The Mamo blob face, as inline SVG for Satori. */
function HelperMark({ size, fill = "#113c42", face = "#ffffff" }: { size: number; fill?: string; face?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <path d={MARK_PATH} fill={fill} />
      <circle cx="86" cy="104" r="7" fill={face} />
      <circle cx="126" cy="100" r="7.5" fill={face} />
      <path d="M90 126 Q110 141 130 122" fill="none" stroke={face} strokeWidth="6" strokeLinecap="round" />
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
        background: "#edebe2",
        color: "#113c42",
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
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <HelperMark size={64} />
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1.5 }}>mamo</div>
          <div style={{ fontSize: 28, color: "#2b4c51", marginLeft: 12 }}>{kicker}</div>
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
            color: "#2b4c51",
          }}
        >
          <div>{siteConfig.tagline}</div>
          <div
            style={{
              background: "#eedc5b",
              color: "#113c42",
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

      <div
        style={{
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          width: 340,
          height: 340,
          borderRadius: 170,
          background: "#eedc5b",
        }}
      >
        <HelperMark size={260} />
      </div>
    </div>
  );
}
