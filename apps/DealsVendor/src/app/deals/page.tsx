"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DealCard from "@/components/DealCard";
import { fetchMyDeals } from "@/lib/api";
import type { Deal } from "@/lib/api";

type FilterTab = "All" | "Active" | "Scheduled" | "Expired";
const tabs: FilterTab[] = ["All", "Active", "Scheduled", "Expired"];

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDeals()
      .then(setDeals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Called by DealCard after a successful delete
  function handleDeleted(id: string) {
    setDeals((prev) => prev.filter((d) => d._id !== id));
  }

  const filtered =
    activeTab === "All" ? deals : deals.filter((d) => d.status === activeTab);

  if (loading)
    return <p className="text-gray-400 text-sm p-4">Loading deals…</p>;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your restaurant deals
          </p>
        </div>
        <Link
          href="/deals/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors flex-shrink-0"
          style={{ backgroundColor: "#3E867A" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#2d6b60")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#3E867A")
          }
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Deal
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count =
            tab === "All"
              ? deals.length
              : deals.filter((d) => d.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#3E867A] hover:text-[#3E867A]"
              }`}
              style={isActive ? { backgroundColor: "#3E867A" } : {}}
            >
              {tab}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Deals grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#9ca3af"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 14l6-6m-5.5-.5h.01m3.99 7h.01M19 12a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            No {activeTab !== "All" ? activeTab.toLowerCase() : ""} deals found
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Create a new deal to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((deal) => (
            <DealCard key={deal._id} deal={deal} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
