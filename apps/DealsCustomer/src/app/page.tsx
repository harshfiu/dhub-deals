import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DealsSection from "@/components/DealsSection";
import BottomNav from "@/components/BottomNav";

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-[#EEF7EE] pb-16 sm:pb-0">
      <Navbar />
      <HeroSection />
      {/* Subtle divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-200" />
      </div>
      <DealsSection />

      <BottomNav />

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
            <img src="/logo.svg" alt="DHub Deals" className="h-7 w-auto" />
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} DHub. Customers always browse free.
          </p>
        </div>
      </footer>
    </main>
  );
}
