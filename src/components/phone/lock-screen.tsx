import type { CSSProperties } from "react";

/**
 * The family member's iPhone lock screen with one FamilyIT notification
 * (demo screens N1, N2 and N12). The date and time are fixed text so the
 * page prerenders and never changes.
 */

const font = "-apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif";

const round: CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: 25,
  background: "rgba(30,30,40,0.28)",
  WebkitBackdropFilter: "blur(16px)",
  backdropFilter: "blur(16px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/** With no `title` the phone is idle: only the date and time show. */
export function LockScreenNotice({ title, body }: { title?: string; body?: string }) {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        boxSizing: "border-box",
        position: "relative",
        background: "linear-gradient(170deg, #7E9CD8 0%, #A9BDE6 38%, #D7CFE8 72%, #EBD6DA 100%)",
        color: "#FFFFFF",
        fontFamily: font,
        overflow: "hidden",
        lineHeight: "normal",
        textAlign: "left",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 11,
          left: "50%",
          transform: "translateX(-50%)",
          width: 124,
          height: 36,
          borderRadius: 18,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 30px 0 34px",
          boxSizing: "border-box",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        <span>Verizon</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="#FFFFFF">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <span
            style={{
              width: 24,
              height: 12,
              boxSizing: "border-box",
              border: "1.5px solid rgba(255,255,255,0.6)",
              borderRadius: 4,
              padding: 1.5,
            }}
          >
            <span
              style={{
                display: "block",
                width: "75%",
                height: "100%",
                background: "#FFFFFF",
                borderRadius: 1.5,
              }}
            />
          </span>
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 62 }}>
        <svg width="16" height="20" viewBox="0 0 16 20" fill="#FFFFFF">
          <path d="M3 8V5.5a5 5 0 0 1 10 0V8h.5A1.5 1.5 0 0 1 15 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 17.5v-8A1.5 1.5 0 0 1 2.5 8zm2 0h6V5.5a3 3 0 0 0-6 0z" />
        </svg>
        <span style={{ marginTop: 10, fontSize: 21, fontWeight: 600, letterSpacing: "0.01em" }}>
          Thursday, November 5
        </span>
        <span
          style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 2 }}
        >
          9:47
        </span>
      </div>
      {title ? (
        <div style={{ padding: "30px 10px 0" }}>
          <div style={{ position: "relative", paddingBottom: 16 }}>
            <div
              className="anim"
              style={{
                animation: "notif 0.45s cubic-bezier(.2,.9,.3,1.1) 0.7s both",
                position: "relative",
                zIndex: 3,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                background: "rgba(250,250,252,0.78)",
                WebkitBackdropFilter: "blur(24px) saturate(1.6)",
                backdropFilter: "blur(24px) saturate(1.6)",
                borderRadius: 24,
                padding: "13px 14px",
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: 9,
                  background: "linear-gradient(160deg, #4C7FE0, #2B5FC4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span style={{ width: 4, height: 8, borderRadius: 3, background: "#FFFFFF" }} />
                <span style={{ width: 4, height: 8, borderRadius: 3, background: "#FFFFFF" }} />
              </span>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#000" }}>FamilyIT</span>
                  <span style={{ fontSize: 14, color: "rgba(60,60,67,0.6)" }}>now</span>
                </span>
                <span style={{ fontSize: 16, lineHeight: 1.3, fontWeight: 600, color: "#000" }}>{title}</span>
                <span style={{ fontSize: 16, lineHeight: 1.3, color: "#1C1C1E" }}>{body}</span>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: 10,
                right: 10,
                bottom: 8,
                height: 40,
                background: "rgba(250,250,252,0.55)",
                borderRadius: 20,
                zIndex: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 20,
                right: 20,
                bottom: 0,
                height: 40,
                background: "rgba(250,250,252,0.38)",
                borderRadius: 18,
                zIndex: 1,
              }}
            />
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 46,
          right: 46,
          bottom: 44,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={round}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
            <path d="M8 3h8l-1 5H9zM9 8h6v3l-2 10h-2L9 11z" />
          </svg>
        </span>
        <span style={round}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 10,
          transform: "translateX(-50%)",
          width: 134,
          height: 5,
          borderRadius: 3,
          background: "#FFFFFF",
        }}
      />
    </div>
  );
}
