"use client";

import { useState } from "react";
import DealCard from "./DealCard";
import { Deal, DiscountType } from "@/types/deal";

const FILTERS: { label: string; value: DiscountType | "all" }[] = [
  { label: "All Deals", value: "all" },
  { label: "% Off", value: "percentage" },
  { label: "Flat Off", value: "flat" },
  { label: "Buy 1 Get 1", value: "bogo" },
];

// Now accepts deals as a prop from page.tsx (which fetches from the API)
// instead of importing the static DEALS array directly
interface DealsSectionProps {
  deals: Deal[];
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<DiscountType | "all">("all");

  const filtered: Deal[] =
    activeFilter === "all"
      ? deals
      : deals.filter((d) => d.discountType === activeFilter);

  return (
    <section id="deals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-gray-800">Today's </span>
            <span className="text-[#008000]">Deals</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""} available near you
          </p>
        </div>

        {/* Filter pills — horizontal scroll on mobile, wrap on desktop */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex-shrink-0 px-4 py-2.5 sm:py-1.5 rounded-full text-sm font-medium transition-colors border min-h-[44px] sm:min-h-0 ${
                activeFilter === f.value
                  ? "bg-[#008000] text-white border-[#008000]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#008000] hover:text-[#008000]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deals — horizontal swipe on mobile, grid on sm+ */}
      {filtered.length > 0 ? (
        <>
          {/* Mobile: horizontal scroll */}
          <div className="sm:hidden -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
            {filtered.map((deal) => (
              <div key={deal.id} className="snap-start flex-shrink-0 w-[82vw]">
                <DealCard deal={deal} />
              </div>
            ))}
          </div>

          {/* sm+: regular grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No deals found for this filter.</p>
        </div>
      )}
    </section>
  );
}