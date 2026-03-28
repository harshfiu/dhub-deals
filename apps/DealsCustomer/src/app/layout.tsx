import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";

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
      <body className="bg-[#F2F5F2] antialiased">
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
