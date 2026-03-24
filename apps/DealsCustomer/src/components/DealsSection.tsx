"use client";

import { useState } from "react";
import DealCard from "./DealCard";
import { DEALS } from "@/data/deals";
import { DietType } from "@/types/deal";

const DIET_FILTERS: { label: DietType; dot: string }[] = [
  { label: "Vegetarian",     dot: "bg-green-500" },
  { label: "Non-Vegetarian", dot: "bg-red-500" },
  { label: "Vegan",          dot: "bg-green-500" },
  { label: "Gluten-Free",    dot: "bg-emerald-500" },
  { label: "Keto",           dot: "bg-gray-400" },
  { label: "Halal",          dot: "bg-green-500" },
  { label: "Kosher",         dot: "bg-blue-500" },
];

const CartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const LocationPinIcon = () => (
  <svg className="w-4 h-4 text-[#4BAEF5] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.314 3.5 8.327a19.583 19.583 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
  </svg>
);

// Group deals by vendor name
function groupByVendor(deals: typeof DEALS) {
  const map = new Map<string, typeof DEALS>();
  for (const deal of deals) {
    const key = deal.restaurant.name;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(deal);
  }
  return map;
}

export default function DealsSection() {
  const [activeDiets, setActiveDiets] = useState<Set<DietType>>(new Set());
  const [search, setSearch] = useState("");

  function toggleDiet(diet: DietType) {
    setActiveDiets(prev => {
      const next = new Set(prev);
      if (next.has(diet)) next.delete(diet); else next.add(diet);
      return next;
    });
  }

  const filtered = DEALS.filter(d => {
    const matchesDiet = activeDiets.size === 0 || (d.dietType && activeDiets.has(d.dietType));
    const matchesSearch = search === "" ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.restaurant.name.toLowerCase().includes(search.toLowerCase());
    return matchesDiet && matchesSearch;
  });

  const grouped = groupByVendor(filtered);

  return (
    <section id="deals">
      {/* ── Delivering to bar ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <LocationPinIcon />
            <div className="text-sm text-gray-500 min-w-0">
              <span className="hidden sm:inline">Delivering to </span>
              <span className="font-bold text-gray-800">2900 AT&amp;T</span>
              <span className="mx-1.5 text-gray-300">|</span>
              <button className="text-[#4BAEF5] hover:underline font-medium">Set Default</button>
              <span className="mx-1.5 text-gray-300">|</span>
              <button className="text-[#4BAEF5] hover:underline font-medium">Change</button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <OrdersIcon />
              <span className="hidden sm:inline">Orders</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#4BAEF5" }}
            >
              <CartIcon />
              $0.00
            </button>
          </div>
        </div>
      </div>

      {/* ── Allergen notice ────────────────────────────────────────────────── */}
      <div className="bg-[#FFFBEB] border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-gray-600">
          <span className="font-bold text-orange-500">Allergen Notice: </span>
          Products may contain soy, milk, nuts, or other allergens. Please verify allergen details under the item description or directly with the vendor before ordering.
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
          Office Lunch Boxes for Your Office
        </h2>

        {/* Search + dietary filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search input */}
          <div className="relative flex-shrink-0 w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4BAEF5]/30 focus:border-[#4BAEF5]"
            />
          </div>

          {/* Diet filter pills */}
          <div className="flex gap-2 flex-wrap">
            {DIET_FILTERS.map(f => {
              const active = activeDiets.has(f.label);
              return (
                <button
                  key={f.label}
                  onClick={() => toggleDiet(f.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? "bg-[#2DBCB0] border-[#2DBCB0] text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-[#2DBCB0] hover:text-[#2DBCB0]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${active ? "bg-white" : f.dot}`} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vendor groups */}
        {grouped.size > 0 ? (
          <div className="space-y-10">
            {Array.from(grouped.entries()).map(([vendorName, deals]) => {
              const r = deals[0].restaurant;
              return (
                <div key={vendorName}>
                  {/* Vendor header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#2DBCB0]">
                      <img
                        src={r.logoUrl}
                        alt={vendorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="border-l-4 border-[#2DBCB0] pl-3">
                      <p className="font-bold text-gray-900 text-base leading-tight">{vendorName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <LocationPinIcon />
                        {r.location} · {r.itemCount} items
                      </p>
                    </div>
                  </div>

                  {/* Items grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {deals.map(deal => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No items found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
