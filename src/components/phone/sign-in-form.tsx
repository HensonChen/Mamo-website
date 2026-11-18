"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const EMAIL = "janie.doe@mail.com";
const LAST_TICK = 54;
const BLUE = "#2B5FC4";
const GREY = "#C9CED6";

const label = { position: "absolute", left: 24, fontSize: 18, fontWeight: 700, color: "#333" } as const;
const box = {
  position: "absolute",
  left: 24,
  right: 24,
  height: 56,
  boxSizing: "border-box",
  borderRadius: 12,
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  fontSize: 20,
} as const;

/**
 * The insurer's sign-in page while FamilyIT signs in: a pointer moves to each
 * field, the email types, the password dots fill in (the password itself is
 * never shown), and the button is pressed. A port of the demo's T4 screen,
 * stepped every 90 ms. With reduced motion it shows the finished state.
 */
export function SignInForm() {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setTick((n) => {
        if (n >= LAST_TICK) {
          clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, 90);
    return () => clearInterval(timer);
  }, [reduced]);

  const n = reduced ? LAST_TICK : tick;
  let cy = 340;
  let cx = 250;
  if (n >= 2) [cy, cx] = [106, 300];
  if (n >= 27) [cy, cx] = [204, 300];
  if (n >= 42) [cy, cx] = [282, 179];
  const pressed = n >= 46 && n < 49;

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <span style={{ position: "absolute", top: 18, left: 24, fontSize: 26, fontWeight: 700, color: "#1F2530" }}>
        Sign in
      </span>
      <span style={{ ...label, top: 66 }}>Email</span>
      <div style={{ ...box, top: 94, border: `2px solid ${n >= 2 && n < 27 ? BLUE : GREY}` }}>
        {EMAIL.slice(0, Math.max(0, Math.min(EMAIL.length, n - 6)))}
      </div>
      <span style={{ ...label, top: 164 }}>Password</span>
      <div
        style={{
          ...box,
          top: 192,
          letterSpacing: 4,
          border: `2px solid ${n >= 27 && n < 42 ? BLUE : GREY}`,
        }}
      >
        {"\u2022".repeat(Math.max(0, Math.min(10, n - 30)))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 268,
          left: 24,
          right: 24,
          height: 60,
          borderRadius: 12,
          background: pressed ? "#2A303B" : "#3B4250",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 700,
          transform: `scale(${pressed ? 0.96 : 1})`,
          transition: "transform 0.12s",
        }}
      >
        {n >= 49 ? "Signing in\u2026" : "Sign in"}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: cy,
          left: cx,
          width: 32,
          height: 32,
          boxSizing: "border-box",
          borderRadius: 16,
          border: `3px solid ${BLUE}`,
          background: pressed ? "rgba(43,95,196,0.6)" : "rgba(43,95,196,0.15)",
          boxShadow: "0 0 0 3px #FFFFFF",
          transition: "top 0.5s ease, left 0.5s ease, background 0.15s",
        }}
      />
    </div>
  );
}
