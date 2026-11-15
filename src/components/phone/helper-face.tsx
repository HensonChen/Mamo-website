/**
 * FamilyIT as a character, not a button: a soft halo, a white ring, a blue
 * disc and two eyes that drift and blink. From the demo's home screen.
 * The motion stops when the visitor prefers reduced motion (see globals.css).
 */
export function HelperFace({ size = 180 }: { size?: number }) {
  const ring = Math.round((size * 120) / 180);
  const disc = Math.round((size * 84) / 180);
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: "#DCE9FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: disc,
            height: disc,
            borderRadius: disc / 2,
            background: "#2B5FC4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="helper-look" style={{ display: "flex", gap: 16 }}>
            <span
              className="helper-blink"
              style={{ width: 10, height: 18, borderRadius: 10, background: "#FFFFFF" }}
            />
            <span
              className="helper-blink"
              style={{ width: 10, height: 18, borderRadius: 10, background: "#FFFFFF" }}
            />
          </span>
        </span>
      </span>
    </span>
  );
}

/** The small bot that floats at the bottom right of in-app website screens. */
export function HelperBot() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        background: "#2B5FC4",
        boxShadow: "0 0 0 4px #FFFFFF, 0 8px 20px rgba(27,37,51,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <span style={{ width: 7, height: 12, borderRadius: 4, background: "#FFFFFF" }} />
      <span style={{ width: 7, height: 12, borderRadius: 4, background: "#FFFFFF" }} />
    </span>
  );
}
