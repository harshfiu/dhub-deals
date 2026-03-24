"use client";

import { useState, useMemo } from "react";
import DealCard from "./DealCard";
import type { Deal } from "@/types/deal";

// Tags data (same as vendor side)
const FOOD_TAGS = [
  { id: "butter_naan",        name: "Butter Naan",        category: "popular" },
  { id: "garlic_naan",        name: "Garlic Naan",        category: "popular" },
  { id: "plain_roti",         name: "Plain Roti",         category: "popular" },
  { id: "kadai_chicken",      name: "Kadai Chicken",      category: "popular" },
  { id: "chicken_burger",     name: "Chicken Burger",     category: "popular" },
  { id: "veg_burger",         name: "Veg Burger",         category: "popular" },
  { id: "margherita_pizza",   name: "Margherita Pizza",   category: "popular" },
  { id: "chicken_fried_rice", name: "Chicken Fried Rice", category: "popular" },
  { id: "falooda",            name: "Falooda",            category: "dessert" },
  { id: "brownie",            name: "Brownie",            category: "dessert" },
  { id: "cake",               name: "Cake",               category: "dessert" },
  { id: "tea",                name: "Tea",                category: "beverages" },
  { id: "coffee",             name: "Coffee",             category: "beverages" },
  { id: "soft_drinks",        name: "Soft Drinks",        category: "beverages" },
  { id: "free_delivery",      name: "Free Delivery",      category: "offer" },
  { id: "buy_one_get_one",    name: "Buy 1 Get 1",        category: "offer" },
  { id: "discount_offer",     name: "Discount Offer",     category: "offer" },
  { id: "chef_special",       name: "Chef Special",       category: "offer" },
  { id: "limited_time",       name: "Limited Time",       category: "offer" },
  { id: "trending",           name: "Trending",           category: "offer" },
  { id: "spicy_food",         name: "Spicy Food",         category: "flavor" },
  { id: "healthy_food",       name: "Healthy Food",       category: "diet" },
  { id: "affordable",         name: "Affordable",         category: "price" },
  { id: "premium_dining",     name: "Premium Dining",     category: "price" },
  { id: "lunch_combo",        name: "Lunch Combo",        category: "meal_type" },
  { id: "dinner_combo",       name: "Dinner Combo",       category: "meal_type" },
  { id: "family_pack",        name: "Family Pack",        category: "occasion" },
  { id: "quick_bites",        name: "Quick Bites",        category: "meal_type" },
  { id: "weekend_special",    name: "Weekend Special",    category: "occasion" },
  { id: "value_meal",         name: "Value Meal",         category: "meal_type" },
];

const DISCOUNT_FILTERS = [
  { label: "All Deals",    value: "all" as const },
  { label: "% Off",        value: "percentage" as const },
  { label: "Flat Off",     value: "flat" as const },
  { label: "Buy 1 Get 1",  value: "bogo" as const },
];

type DiscountFilter = "all" | "percentage" | "flat" | "bogo";

interface DealsSectionProps {
  deals: Deal[];
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const [discountFilter, setDiscountFilter] = useState<DiscountFilter>("all");
  const [activeTags,     setActiveTags]     = useState<string[]>([]);
  const [searchQuery,    setSearchQuery]    = useState("");

  function toggleTag(id: string) {
    setActiveTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      // Discount type filter
      if (discountFilter !== "all" && deal.discountType !== discountFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          deal.title.toLowerCase().includes(q) ||
          deal.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Tag filter — deal must have ALL selected tags
      if (activeTags.length > 0) {
        const dealTags: string[] = (deal as any).tags ?? [];
        const hasAll = activeTags.every((t) => dealTags.includes(t));
        if (!hasAll) return false;
      }

      return true;
    });
  }, [deals, discountFilter, activeTags, searchQuery]);

  return (
    <section id="deals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-gray-800">Today's </span>
            <span className="text-[#008000]">Deals</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""} available near you
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search deals..."
          className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#008000]"
        />
      </div>

      {/* Discount type filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0 mb-4">
        {DISCOUNT_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setDiscountFilter(f.value)}
            className={`flex-shrink-0 px-4 py-2.5 sm:py-1.5 rounded-full text-sm font-medium transition-colors border min-h-[44px] sm:min-h-0 ${
              discountFilter === f.value
                ? "bg-[#008000] text-white border-[#008000]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#008000] hover:text-[#008000]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tag filter — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
        {FOOD_TAGS.map((tag) => {
          const isActive = activeTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                isActive
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-500 hover:text-gray-800"
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {/* Active tag chips */}
      {activeTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-xs text-gray-400">Filtering by:</span>
          {activeTags.map((id) => {
            const tag = FOOD_TAGS.find((t) => t.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 text-white rounded-full text-xs font-medium"
              >
                {tag?.name}
                <button onClick={() => toggleTag(id)} className="ml-0.5 hover:opacity-70">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M6.414 5l2.293-2.293a1 1 0 00-1.414-1.414L5 3.586 2.707 1.293a1 1 0 00-1.414 1.414L3.586 5 1.293 7.293a1 1 0 001.414 1.414L5 6.414l2.293 2.293a1 1 0 001.414-1.414L6.414 5z"/>
                  </svg>
                </button>
              </span>
            );
          })}
          <button
            onClick={() => setActiveTags([])}
            className="text-xs text-gray-400 underline hover:text-gray-600"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Deals grid */}
      {filtered.length > 0 ? (
        <>
          <div className="sm:hidden -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
            {filtered.map((deal) => (
              <div key={deal.id} className="snap-start flex-shrink-0 w-[82vw]">
                <DealCard deal={deal} />
              </div>
            ))}
          </div>
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No deals found.</p>
          <button
            onClick={() => { setActiveTags([]); setDiscountFilter("all"); setSearchQuery(""); }}
            className="text-sm underline mt-2 hover:text-gray-600"
          >
            Clear filters
          </button>
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