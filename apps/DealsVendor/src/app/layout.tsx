import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "DHub Vendor Portal",
  description: "Manage your restaurant deals on DHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f4f7f4]">
        <div className="flex h-screen overflow-hidden">
          {/* Fixed sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-6 bg-[#f4f7f4]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
