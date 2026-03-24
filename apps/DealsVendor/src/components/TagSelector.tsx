"use client";

import { useState, useMemo } from "react";

// All tags from dhub-food-tags.json grouped by category
const FOOD_TAGS = [
  { id: "butter_naan",        name: "Butter Naan",        category: "popular" },
  { id: "garlic_naan",        name: "Garlic Naan",        category: "popular" },
  { id: "plain_roti",         name: "Plain Roti",         category: "popular" },
  { id: "lachha_paratha",     name: "Lachha Paratha",     category: "popular" },
  { id: "rumali_roti",        name: "Rumali Roti",        category: "popular" },
  { id: "kadai_chicken",      name: "Kadai Chicken",      category: "popular" },
  { id: "chicken_hand",       name: "Chicken Handi",      category: "popular" },
  { id: "chicken_korma",      name: "Chicken Korma",      category: "popular" },
  { id: "chicken_do_pyaza",   name: "Chicken Do Pyaza",   category: "popular" },
  { id: "chicken_saag",       name: "Chicken Saag",       category: "popular" },
  { id: "mutton_korma",       name: "Mutton Korma",       category: "popular" },
  { id: "mutton_rogan_josh",  name: "Mutton Rogan Josh",  category: "popular" },
  { id: "mutton_hand",        name: "Mutton Handi",       category: "popular" },
  { id: "fish_fry",           name: "Fish Fry",           category: "popular" },
  { id: "fish_tikka",         name: "Fish Tikka",         category: "popular" },
  { id: "paneer_chilli",      name: "Paneer Chilli",      category: "popular" },
  { id: "paneer_do_pyaza",    name: "Paneer Do Pyaza",    category: "popular" },
  { id: "veg_fried_rice",     name: "Veg Fried Rice",     category: "popular" },
  { id: "egg_fried_rice",     name: "Egg Fried Rice",     category: "popular" },
  { id: "chicken_fried_rice", name: "Chicken Fried Rice", category: "popular" },
  { id: "veg_noodles",        name: "Veg Noodles",        category: "popular" },
  { id: "egg_noodles",        name: "Egg Noodles",        category: "popular" },
  { id: "chicken_noodles",    name: "Chicken Noodles",    category: "popular" },
  { id: "margherita_pizza",   name: "Margherita Pizza",   category: "popular" },
  { id: "farmhouse_pizza",    name: "Farmhouse Pizza",    category: "popular" },
  { id: "pepperoni_pizza",    name: "Pepperoni Pizza",    category: "popular" },
  { id: "veg_burger",         name: "Veg Burger",         category: "popular" },
  { id: "chicken_burger",     name: "Chicken Burger",     category: "popular" },
  { id: "club_sandwich",      name: "Club Sandwich",      category: "popular" },
  { id: "grilled_sandwich",   name: "Grilled Sandwich",   category: "popular" },
  { id: "chicken_roll",       name: "Chicken Roll",       category: "popular" },
  { id: "paneer_roll",        name: "Paneer Roll",        category: "popular" },
  { id: "egg_roll",           name: "Egg Roll",           category: "popular" },
  { id: "falooda",            name: "Falooda",            category: "dessert" },
  { id: "brownie",            name: "Brownie",            category: "dessert" },
  { id: "cake",               name: "Cake",               category: "dessert" },
  { id: "tea",                name: "Tea",                category: "beverages" },
  { id: "coffee",             name: "Coffee",             category: "beverages" },
  { id: "soft_drinks",        name: "Soft Drinks",        category: "beverages" },
  { id: "smoothies",          name: "Smoothies",          category: "beverages" },
  { id: "north_indian_thali", name: "North Indian Thali", category: "meal_type" },
  { id: "south_indian_thali", name: "South Indian Thali", category: "meal_type" },
  { id: "buffet",             name: "Buffet",             category: "service" },
  { id: "catering",           name: "Catering",           category: "service" },
  { id: "kids_meal",          name: "Kids Meal",          category: "meal_type" },
  { id: "quick_delivery",     name: "Quick Delivery",     category: "service" },
  { id: "free_delivery",      name: "Free Delivery",      category: "offer" },
  { id: "buy_one_get_one",    name: "Buy 1 Get 1",        category: "offer" },
  { id: "discount_offer",     name: "Discount Offer",     category: "offer" },
  { id: "spicy_food",         name: "Spicy Food",         category: "flavor" },
  { id: "extra_spicy",        name: "Extra Spicy",        category: "flavor" },
  { id: "less_spicy",         name: "Less Spicy",         category: "flavor" },
  { id: "comfort_food",       name: "Comfort Food",       category: "style" },
  { id: "street_style",       name: "Street Style",       category: "style" },
  { id: "healthy_food",       name: "Healthy Food",       category: "diet" },
  { id: "low_calorie",        name: "Low Calorie",        category: "diet" },
  { id: "weekend_special",    name: "Weekend Special",    category: "occasion" },
  { id: "festival_special",   name: "Festival Special",   category: "occasion" },
  { id: "lunch_combo",        name: "Lunch Combo",        category: "meal_type" },
  { id: "dinner_combo",       name: "Dinner Combo",       category: "meal_type" },
  { id: "office_lunch",       name: "Office Lunch",       category: "occasion" },
  { id: "family_pack",        name: "Family Pack",        category: "occasion" },
  { id: "mini_meal",          name: "Mini Meal",          category: "meal_type" },
  { id: "value_meal",         name: "Value Meal",         category: "meal_type" },
  { id: "late_night_food",    name: "Late Night Food",    category: "occasion" },
  { id: "midnight_delivery",  name: "Midnight Delivery",  category: "service" },
  { id: "premium_dining",     name: "Premium Dining",     category: "price" },
  { id: "affordable",         name: "Affordable",         category: "price" },
  { id: "quick_bites",        name: "Quick Bites",        category: "meal_type" },
  { id: "best_for_couples",   name: "Best for Couples",   category: "occasion" },
  { id: "group_order",        name: "Group Order",        category: "occasion" },
  { id: "takeaway_special",   name: "Takeaway Special",   category: "service" },
  { id: "chef_special",       name: "Chef Special",       category: "offer" },
  { id: "limited_time",       name: "Limited Time Offer", category: "offer" },
  { id: "new_arrival",        name: "New Arrival",        category: "offer" },
  { id: "trending",           name: "Trending",           category: "offer" },
];

// Pretty labels for each category
const CATEGORY_LABELS: Record<string, string> = {
  popular:   "Popular Items",
  dessert:   "Desserts",
  beverages: "Beverages",
  meal_type: "Meal Types",
  service:   "Services",
  offer:     "Offers",
  flavor:    "Flavors",
  style:     "Food Style",
  diet:      "Diet",
  occasion:  "Occasions",
  price:     "Price Range",
};

// Category accent colors
const CATEGORY_COLORS: Record<string, string> = {
  popular:   "#3E867A",
  dessert:   "#D97706",
  beverages: "#2563EB",
  meal_type: "#7C3AED",
  service:   "#059669",
  offer:     "#DC2626",
  flavor:    "#EA580C",
  style:     "#0891B2",
  diet:      "#16A34A",
  occasion:  "#9333EA",
  price:     "#CA8A04",
};

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function TagSelector({
  selectedTags,
  onChange,
  maxTags = 10,
}: TagSelectorProps) {
  const [search,          setSearch]          = useState("");
  const [activeCategory,  setActiveCategory]  = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(FOOD_TAGS.map((t) => t.category))],
    []
  );

  const filtered = useMemo(() => {
    let tags = FOOD_TAGS;
    if (activeCategory) tags = tags.filter((t) => t.category === activeCategory);
    if (search.trim())  tags = tags.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
    return tags;
  }, [search, activeCategory]);

  function toggle(id: string) {
    if (selectedTags.includes(id)) {
      onChange(selectedTags.filter((t) => t !== id));
    } else {
      if (selectedTags.length >= maxTags) return;
      onChange([...selectedTags, id]);
    }
  }

  function removeTag(id: string) {
    onChange(selectedTags.filter((t) => t !== id));
  }

  const selectedTagObjects = FOOD_TAGS.filter((t) => selectedTags.includes(t.id));

  return (
    <div className="space-y-3">
      {/* Selected tags */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-[44px]">
          {selectedTagObjects.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: CATEGORY_COLORS[tag.category] }}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="hover:opacity-70 transition-opacity ml-0.5"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M6.414 5l2.293-2.293a1 1 0 00-1.414-1.414L5 3.586 2.707 1.293a1 1 0 00-1.414 1.414L3.586 5 1.293 7.293a1 1 0 001.414 1.414L5 6.414l2.293 2.293a1 1 0 001.414-1.414L6.414 5z"/>
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {selectedTags.length}/{maxTags} tags selected
      </p>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tags..."
        className="input"
      />

      {/* Category filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeCategory === null
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeCategory === cat
                ? "text-white border-transparent"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
            style={activeCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Tag grid */}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 w-full text-center">No tags found</p>
        ) : (
          filtered.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            const color      = CATEGORY_COLORS[tag.category];
            const atMax      = !isSelected && selectedTags.length >= maxTags;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggle(tag.id)}
                disabled={atMax}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  atMax ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: color, color: "white", borderColor: color }
                    : { backgroundColor: "white", color: "#374151", borderColor: "#e5e7eb" }
                }
              >
                {tag.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// Export tags data for use in the customer app
export { FOOD_TAGS, CATEGORY_LABELS, CATEGORY_COLORS };