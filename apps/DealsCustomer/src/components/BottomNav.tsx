"use client";

import { useState } from "react";

const tabs = [
  {
    key: "home",
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#008000]" : "text-gray-400"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 2}>
        {active ? (
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        )}
        {active && (
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        )}
      </svg>
    ),
  },
  {
    key: "search",
    label: "Search",
    href: "#deals",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#008000]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
      </svg>
    ),
  },
  {
    key: "saved",
    label: "Saved",
    href: "#",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#008000]" : "text-gray-400"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    href: "#",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#008000]" : "text-gray-400"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={tab.href}
            onClick={() => setActive(tab.key)}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-[44px]"
          >
            {tab.icon(active === tab.key)}
            <span className={`text-[10px] font-medium ${active === tab.key ? "text-[#008000]" : "text-gray-400"}`}>
              {tab.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
