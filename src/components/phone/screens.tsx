import type { CSSProperties, ReactNode } from "react";
import { HelperBot, HelperFace } from "@/components/phone/helper-face";

/**
 * Static ports of the WireframeDemoStyled2 screens. Sizes, colors, radii and
 * spacing are taken from the artboards' inline styles. Each screen is drawn at
 * 390 x 844 and scaled by PhoneFrame. Nothing here moves except the helper
 * character's eyes.
 */

const BLUE = "#2B5FC4";
const LINK_BLUE = "#1F4FA8";
const INK = "#1B2533";
const SOFT = "#4B5768";

const screenBase: CSSProperties = {
  width: 390,
  height: 844,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  color: INK,
  overflow: "hidden",
  lineHeight: "normal",
  fontFamily: "inherit",
  textAlign: "left",
};

function BackLink({ label }: { label: string }) {
  return (
    <span
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "0 8px",
        fontSize: 20,
        fontWeight: 700,
        color: LINK_BLUE,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M15 6l-6 6 6 6" />
      </svg>
      {label}
    </span>
  );
}

function MicIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

/** The voice control, same place and size on every chat screen. */
function VoiceControl({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flexShrink: 0,
        height: 176,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 32,
      }}
    >
      {children}
    </div>
  );
}

function TalkButton() {
  return (
    <span
      style={{
        width: 300,
        height: 84,
        boxSizing: "border-box",
        borderRadius: 42,
        background: BLUE,
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontSize: 24,
        fontWeight: 700,
      }}
    >
      <MicIcon />
      Tap to talk
    </span>
  );
}

const userBubble: CSSProperties = {
  alignSelf: "flex-end",
  maxWidth: "82%",
  boxSizing: "border-box",
  background: "#F1F3F6",
  borderRadius: "20px 20px 4px 20px",
  padding: "12px 16px",
  fontSize: 24,
  lineHeight: 1.45,
};

/** T0: FamilyIT greets the person. `intro` changes who set it up. */
export function HomeScreen({ intro }: { intro: string }) {
  return (
    <div style={{ ...screenBase, background: "#EEF4FC" }}>
      <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", padding: "60px 24px 0" }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>FamilyIT</span>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: "0 32px",
          textAlign: "center",
        }}
      >
        <HelperFace />
        <p style={{ margin: 0, fontSize: 34, lineHeight: 1.3, fontWeight: 700 }}>Hi! What do you need help with?</p>
        <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5, color: SOFT }}>{intro}</p>
      </div>
      <VoiceControl>
        <TalkButton />
      </VoiceControl>
    </div>
  );
}

const WAVE = [12, 16, 18, 22, 40, 62, 30, 44, 64, 34, 48, 26, 20, 18, 16, 12];

/** T1: the person talks, and a live caption shows what FamilyIT heard. */
export function ListeningScreen() {
  return (
    <div style={{ ...screenBase, background: "#FFFFFF" }}>
      <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", padding: "60px 24px 0" }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>FamilyIT</span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 32px 8px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <p style={{ margin: 0, fontSize: 28, lineHeight: 1.45, fontWeight: 700 }}>
          &ldquo;Oh, my car insurance company wants me to confirm something. I don&apos;t know how to do this&hellip;&rdquo;
        </p>
      </div>
      <div
        style={{
          flexShrink: 0,
          height: 176,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span style={{ height: 92, display: "flex", alignItems: "center", gap: 8 }}>
            {WAVE.map((h, i) => (
              <span key={i} style={{ width: 6, height: h, borderRadius: 3, background: BLUE }} />
            ))}
          </span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Tap when you&rsquo;re done</span>
        </div>
      </div>
    </div>
  );
}

function CarBadge() {
  return (
    <span
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: "#3B4250",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF">
        <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v1.5a1.5 1.5 0 0 1-3 0V17H8v1.5a1.5 1.5 0 0 1-3 0V17H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm2.2 0h9.6l-1.1-3.3a.6.6 0 0 0-.6-.4H8.9a.6.6 0 0 0-.6.4z" />
      </svg>
    </span>
  );
}

/** T2b: FamilyIT finds the email and checks that it is real. */
export function EmailScreen() {
  const mask = "linear-gradient(to bottom, transparent 0, #000 40px)";
  return (
    <div style={{ ...screenBase, background: "#FFFFFF" }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", padding: "56px 12px 0" }}>
        <BackLink label="Home" />
      </div>
      <div style={{ flexShrink: 0, padding: "0 24px" }}>
        <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>Car insurance message</span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 24,
          padding: "12px 24px 8px",
          overflow: "hidden",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <div style={userBubble}>Oh, my car insurance company wants me to confirm something. I don&apos;t know how to do this&hellip;</div>
        <p style={{ margin: 0, fontSize: 24, lineHeight: 1.45, color: SOFT }}>
          Tell me more about the message. Where did you get it?
        </p>
        <div style={userBubble}>It&apos;s an email I got this morning.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 24, lineHeight: 1.45, fontWeight: 700 }}>
            I found it in your inbox. It&apos;s really from Evergreen Mutual. Do you want help with it?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid #E3E7ED",
                borderRadius: 20,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CarBadge />
                <span style={{ fontSize: 22, fontWeight: 700 }}>Evergreen Mutual</span>
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1E6B47",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12l5 5 9-10" />
                </svg>
                Matches your insurance
              </span>
              <span style={{ fontSize: 22, lineHeight: 1.45 }}>Please confirm your updated auto policy by Nov 15.</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ ...demoButton, flex: 1, background: BLUE, color: "#FFFFFF" }}>Yes, help me</span>
              <span style={{ ...demoButton, flex: 1, background: "#FFFFFF", color: INK, border: "2px solid #7A8799" }}>
                Not now
              </span>
            </div>
          </div>
        </div>
      </div>
      <VoiceControl>
        <TalkButton />
      </VoiceControl>
    </div>
  );
}

const demoButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  height: 64,
  padding: "0 16px",
  borderRadius: 20,
  fontSize: 20,
  fontWeight: 700,
  boxSizing: "border-box",
  whiteSpace: "nowrap",
};

/** The in-app browser: a website opens inside FamilyIT, so the person never leaves the app. */
function WebviewShell({ bubble, children }: { bubble: string; children: ReactNode }) {
  return (
    <div style={{ ...screenBase, background: "#EEF4FC" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(27,37,51,0.45)" }} />
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px 0 8px",
            borderBottom: "2px solid #C3D7F2",
          }}
        >
          <BackLink label="Back" />
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, color: SOFT }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            evergreenmutual.com
          </span>
        </div>
        {/* The insurer's own website: its look, not FamilyIT's. */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: "#FBFBFC" }}>
          <div
            style={{
              flexShrink: 0,
              height: 52,
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              background: "#EFF1F4",
              borderBottom: "2px solid #C9CED6",
              gap: 12,
              fontSize: 20,
              fontWeight: 700,
              color: "#1F2530",
            }}
          >
            <CarBadge />
            <span>Evergreen Mutual</span>
          </div>
          {children}
        </div>
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 336,
              boxSizing: "border-box",
              background: "#FFFFFF",
              border: `2px solid ${BLUE}`,
              borderRadius: "20px 20px 4px 20px",
              padding: "12px 16px 16px",
              boxShadow: "0 12px 32px rgba(27,37,51,0.22)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: LINK_BLUE }}>FamilyIT</span>
            <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5, fontWeight: 700 }}>{bubble}</p>
          </div>
          <HelperBot />
        </div>
      </div>
    </div>
  );
}

const fieldLabel: CSSProperties = { position: "absolute", left: 24, fontSize: 18, fontWeight: 700, color: "#333" };
const fieldBox: CSSProperties = {
  position: "absolute",
  left: 24,
  right: 24,
  height: 56,
  boxSizing: "border-box",
  border: "2px solid #C9CED6",
  borderRadius: 12,
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  fontSize: 20,
};

/** T4: FamilyIT signs in with the saved login, after the person says OK. The password is hidden. */
export function SignInScreen({ message }: { message: string }) {
  return (
    <WebviewShell bubble={message}>
      <div style={{ position: "relative", flex: 1 }}>
        <span style={{ position: "absolute", top: 18, left: 24, fontSize: 26, fontWeight: 700, color: "#1F2530" }}>
          Sign in
        </span>
        <span style={{ ...fieldLabel, top: 66 }}>Email</span>
        <div style={{ ...fieldBox, top: 94 }}>amber.lee@mail.com</div>
        <span style={{ ...fieldLabel, top: 164 }}>Password</span>
        <div style={{ ...fieldBox, top: 192, letterSpacing: 4 }}>{"\u2022".repeat(10)}</div>
        <div
          style={{
            position: "absolute",
            top: 268,
            left: 24,
            right: 24,
            height: 60,
            borderRadius: 12,
            background: "#2A303B",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Signing in&hellip;
        </div>
      </div>
    </WebviewShell>
  );
}

/** T5: FamilyIT explains what changed and circles the one button to tap. */
export function ExplainScreen() {
  const row: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "8px 16px",
  };
  const value: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: 20,
    fontWeight: 700,
  };
  return (
    <WebviewShell bubble="Your price goes up $140 a year. Your coverage stays the same. If everything looks good, tap Confirm.">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, padding: "12px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 26, lineHeight: 1.25, fontWeight: 700, color: "#1F2530" }}>Your updated auto policy</span>
          <span style={{ fontSize: 18, color: "#555" }}>Please confirm by Nov 15</span>
        </div>
        <div style={{ border: "2px solid #C9CED6", borderRadius: 12, background: "#FFFFFF" }}>
          <div style={{ ...row, borderBottom: "1px solid #DDDDDD" }}>
            <span style={{ fontSize: 19, color: "#444" }}>Yearly price</span>
            <span style={value}>
              $1,240
              <span style={{ fontSize: 18, color: "#666", fontWeight: 400 }}>was $1,100</span>
            </span>
          </div>
          <div style={{ ...row, borderBottom: "1px solid #DDDDDD" }}>
            <span style={{ fontSize: 19, color: "#444" }}>Coverage</span>
            <span style={value}>Same as last year</span>
          </div>
          <div style={row}>
            <span style={{ fontSize: 19, color: "#444" }}>Starts</span>
            <span style={value}>Nov 20, 2026</span>
          </div>
        </div>
        <span style={{ fontSize: 19, fontWeight: 700, color: "#333" }}>Nothing to pay today.</span>
        {/* FamilyIT circles the one button to tap. */}
        <div
          style={{
            margin: "4px 4px 0",
            height: 60,
            borderRadius: 12,
            background: "#3B4250",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 21,
            fontWeight: 700,
            outline: `4px solid ${BLUE}`,
            outlineOffset: 4,
            boxShadow: "0 0 0 12px rgba(120,170,255,0.55)",
          }}
        >
          Confirm
        </div>
      </div>
    </WebviewShell>
  );
}

const recapItems = (who: string) => [
  { title: "Opened Evergreen\u2019s website", sub: `${who === "You" ? "You" : who} stayed in FamilyIT` },
  { title: "Signed in with a saved login", sub: `With ${who === "You" ? "your" : who + "\u2019s"} OK \u00B7 password hidden` },
  { title: "Explained the price change", sub: "$1,100 \u2192 $1,240 a year" },
  { title: `${who === "You" ? "You" : who} tapped Confirm`, sub: "Copy sent to the email on file" },
];

/** H2: the recap the family or the community sees when they have time. */
export function RecapScreen({ who, action }: { who: string; action: string }) {
  const items = recapItems(who);
  return (
    <div style={{ ...screenBase, background: "#FFFFFF" }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "56px 12px 4px" }}>
        <BackLink label="Back" />
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 4, padding: "0 20px" }}>
        <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>{who} &middot; Car insurance message</span>
        <span style={{ fontSize: 18, color: SOFT }}>Thursday, Nov 5, 2026 &middot; 9:41&ndash;9:47 AM</span>
      </div>
      <div style={{ flexShrink: 0, display: "flex", gap: 12, padding: "20px 16px 0" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 8,
            padding: 16,
            borderRadius: 20,
            background: "#E9F5EE",
            border: "2px solid #B5DBC4",
          }}
        >
          <span style={{ fontSize: 18, color: SOFT }}>Status</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#1E6B47" }}>Completed</span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 8,
            padding: 16,
            borderRadius: 20,
            background: "#EEF4FC",
            border: "2px solid #C3D7F2",
          }}
        >
          <span style={{ fontSize: 18, color: SOFT }}>Action needed</span>
          <span style={{ fontSize: 24, fontWeight: 700 }}>No</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "16px 20px 0", overflow: "hidden" }}>
        <span style={{ fontSize: 22, fontWeight: 700, padding: "8px 0 4px" }}>
          What FamilyIT helped {who === "You" ? "you" : who} with
        </span>
        {items.map((item, i) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              padding: "16px 4px",
              borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.3)" : undefined,
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: 16,
                background: "#1E6B47",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</span>
              <span style={{ fontSize: 16, lineHeight: 1.45, color: SOFT }}>{item.sub}</span>
            </span>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, padding: "12px 16px 32px" }}>
        <span style={{ ...demoButton, width: "100%", background: BLUE, color: "#FFFFFF" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
          </svg>
          {action}
        </span>
      </div>
    </div>
  );
}
