"use client";

import { useState } from "react";

const MapPinIcon = () => (
  <svg
    className="w-4 h-4 text-[#008000] flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.314 3.5 8.327a19.583 19.583 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Navbar() {
  const [location, setLocation] = useState("Dallas, TX");

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img src="/logo.svg" alt="DHub Deals" className="h-12 w-auto" />
          </a>

          {/* Location Selector — center */}
          <div className="flex-1 flex justify-center">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-[#008000] hover:shadow-sm transition-all duration-150 text-sm text-gray-700 font-medium max-w-xs w-full justify-center"
              aria-label="Change location"
            >
              <MapPinIcon />
              <span className="truncate">{location}</span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* Right nav links */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <a
              href="#deals"
              className="hidden sm:block px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#008000] rounded-lg transition-colors"
            >
              Explore All
            </a>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Profile"
            >
              <ProfileIcon />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
