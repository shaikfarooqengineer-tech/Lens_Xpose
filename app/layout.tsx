import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lens Expose — Photography & Films",
  description: "Photographs and films you can feel. A portfolio of light, people, and stories.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

