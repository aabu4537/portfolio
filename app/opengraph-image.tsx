import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "repeating-linear-gradient(90deg, #1E7A2E 0px, #1E7A2E 100px, #27913A 100px, #27913A 200px)",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#F8F8F8",
            letterSpacing: 6,
            marginBottom: 24,
            textShadow: "3px 3px 0 #0A0A2E",
          }}
        >
          CAREER CHAMPIONSHIP '26
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 800,
            color: "#F8D800",
            textShadow: "8px 8px 0 #D82800",
            letterSpacing: 4,
          }}
        >
          ALAM BUSHARA
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#F8F8F8",
            marginTop: 28,
            letterSpacing: 4,
            textShadow: "3px 3px 0 #0A0A2E",
          }}
        >
          QUALITY DATA ENGINEER • PRESS START
        </div>
      </div>
    ),
    { ...size }
  );
}
