"use client";

import { useState, useMemo } from "react";
import DealCard from "./DealCard";
import type { Deal } from "@/types/deal";

const FOOD_TAGS = [
  { id: "butter_naan",        name: "Butter Naan",        category: "popular"   },
  { id: "garlic_naan",        name: "Garlic Naan",        category: "popular"   },
  { id: "plain_roti",         name: "Plain Roti",         category: "popular"   },
  { id: "kadai_chicken",      name: "Kadai Chicken",      category: "popular"   },
  { id: "chicken_burger",     name: "Chicken Burger",     category: "popular"   },
  { id: "veg_burger",         name: "Veg Burger",         category: "popular"   },
  { id: "margherita_pizza",   name: "Margherita Pizza",   category: "popular"   },
  { id: "chicken_fried_rice", name: "Chicken Fried Rice", category: "popular"   },
  { id: "falooda",            name: "Falooda",            category: "dessert"   },
  { id: "brownie",            name: "Brownie",            category: "dessert"   },
  { id: "cake",               name: "Cake",               category: "dessert"   },
  { id: "tea",                name: "Tea",                category: "beverages" },
  { id: "coffee",             name: "Coffee",             category: "beverages" },
  { id: "soft_drinks",        name: "Soft Drinks",        category: "beverages" },
  { id: "free_delivery",      name: "Free Delivery",      category: "offer"     },
  { id: "buy_one_get_one",    name: "Buy 1 Get 1",        category: "offer"     },
  { id: "discount_offer",     name: "Discount Offer",     category: "offer"     },
  { id: "chef_special",       name: "Chef Special",       category: "offer"     },
  { id: "limited_time",       name: "Limited Time",       category: "offer"     },
  { id: "trending",           name: "Trending",           category: "offer"     },
  { id: "spicy_food",         name: "Spicy Food",         category: "flavor"    },
  { id: "healthy_food",       name: "Healthy Food",       category: "diet"      },
  { id: "affordable",         name: "Affordable",         category: "price"     },
  { id: "premium_dining",     name: "Premium Dining",     category: "price"     },
  { id: "lunch_combo",        name: "Lunch Combo",        category: "meal_type" },
  { id: "dinner_combo",       name: "Dinner Combo",       category: "meal_type" },
  { id: "family_pack",        name: "Family Pack",        category: "occasion"  },
  { id: "quick_bites",        name: "Quick Bites",        category: "meal_type" },
  { id: "weekend_special",    name: "Weekend Special",    category: "occasion"  },
  { id: "value_meal",         name: "Value Meal",         category: "meal_type" },
];

const CATEGORY_ICONS: Record<string, string> = {
  all:       "✦",
  popular:   "🔥",
  dessert:   "🍰",
  beverages: "🥤",
  meal_type: "🍽️",
  service:   "🛵",
  offer:     "🏷️",
  flavor:    "🌶️",
  style:     "🎨",
  diet:      "🥗",
  occasion:  "🎉",
  price:     "💰",
};

function formatCategory(id: string): string {
  if (id === "all") return "All";
  return id.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

const CATEGORIES = [
  "all",
  ...Array.from(new Set(FOOD_TAGS.map((t) => t.category))),
];

const DISCOUNT_FILTERS = [
  { label: "All Deals",   value: "all"        as const },
  { label: "% Off",       value: "percentage" as const },
  { label: "Flat Off",    value: "flat"       as const },
  { label: "Buy 1 Get 1", value: "bogo"       as const },
];

type DiscountFilter = "all" | "percentage" | "flat" | "bogo";

interface DealsSectionProps {
  deals: Deal[];
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const [discountFilter, setDiscountFilter] = useState<DiscountFilter>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery,    setSearchQuery]    = useState("");

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      if (discountFilter !== "all" && deal.discountType !== discountFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          deal.title.toLowerCase().includes(q) ||
          deal.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (activeCategory !== "all") {
        const dealTags: string[] = (deal as any).tags ?? [];
        const categoryTagIds = FOOD_TAGS
          .filter((t) => t.category === activeCategory)
          .map((t) => t.id);
        const hasMatch = dealTags.some((id) => categoryTagIds.includes(id));
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [deals, discountFilter, activeCategory, searchQuery]);

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
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search deals..."
          className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#008000]"
        />
      </div>

      {/* Discount type pills */}
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

      {/* Category filter — horizontal scroll */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const icon     = CATEGORY_ICONS[cat] ?? "◆";
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800"
                }`}
              >
                <span className="text-sm leading-none">{icon}</span>
                {formatCategory(cat)}
              </button>
            );
          })}
        </div>
      </div>

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
            onClick={() => {
              setActiveCategory("all");
              setDiscountFilter("all");
              setSearchQuery("");
            }}
            className="text-sm underline mt-2 hover:text-gray-600"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}