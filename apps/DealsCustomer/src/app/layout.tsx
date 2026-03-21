import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DHub Deals — Discover Local Food Deals",
  description:
    "Browse exclusive restaurant deals near you. Discover, save, and avail deals from local restaurants on DHub.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#EEF7EE] antialiased">{children}</body>
    </html>
  );
}
