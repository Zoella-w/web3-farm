import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React + Next.js Template",
  description: "A minimal React + Next.js template with TypeScript, Tailwind CSS, and App Router.",
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
