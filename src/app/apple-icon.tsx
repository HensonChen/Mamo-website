import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eef4fc",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="150" height="150">
          <circle cx="50" cy="50" r="48" fill="#2b5fc4" />
          <rect x="31" y="36" width="12" height="26" rx="6" fill="#fff" />
          <rect x="57" y="36" width="12" height="26" rx="6" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
