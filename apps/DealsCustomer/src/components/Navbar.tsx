"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LocationIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const [location, setLocation] = useState("Dallas, Texas");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    const token = localStorage.getItem("dhub_customer_token");
    const user = localStorage.getItem("dhub_customer");
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(
          parsed.restaurantName || parsed.email?.split("@")[0] || "User",
        );
      } catch {}
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("dhub_customer_token");
    localStorage.removeItem("dhub_customer");
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="DHub" width={90} height={56} priority />
          </Link>

          {/* Location search — center */}
          <div className="hidden sm:flex flex-1 max-w-xs items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white hover:border-gray-300 transition-colors cursor-pointer">
            <LocationIcon />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
              placeholder="Enter your location"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Explore All */}
            <button className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Explore All <ChevronDown />
            </button>

            {isLoggedIn ? (
              /* Logged-in user menu */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#008000] flex items-center justify-center text-white text-sm font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {userName}
                  </span>
                  <ChevronDown />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userName}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/#deals"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Saved Deals
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth buttons */
              <>
                <Link
                  href="/signup"
                  className="hidden sm:flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#0d1b2a" }}
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#1a3a5c" }}
                >
                  Log In
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {/* Mobile location */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 mb-3">
            <LocationIcon />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none w-full"
              placeholder="Enter your location"
            />
          </div>
          <Link
            href="/#deals"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Explore Deals
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
            >
              Log out
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                href="/signup"
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white text-center"
                style={{ backgroundColor: "#0d1b2a" }}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white text-center"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
