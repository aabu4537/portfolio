import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alam Bushara | Data Engineer",
  description:
    "Quality Data Engineer specializing in Palantir Foundry, Python, and production data pipelines. Builder of Raumdeuter, a World Cup 2026 match predictor.",
  openGraph: {
    title: "Alam Bushara | Data Engineer",
    description:
      "Palantir Foundry, Python, and production data pipelines. Press start.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
