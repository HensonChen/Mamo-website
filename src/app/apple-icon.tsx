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
          background: "#eedc5b",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="150" height="150">
          <path d="M65.91 51.2 C88.76 38.63 126.28 41.91 138 44 C165.64 48.92 184 70 180 106 C176 142 150 166 112 168 C78 170 39.87 162.06 26 132 C14 106 25.91 73.2 65.91 51.2 Z" fill="#113c42" />
          <circle cx="86" cy="104" r="7" fill="#ffffff" />
          <circle cx="126" cy="100" r="7.5" fill="#ffffff" />
          <path d="M90 126 Q110 141 130 122" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
