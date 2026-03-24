export type DiscountType = "percentage" | "flat" | "bogo";
export type AvailPath = "website" | "phone" | "walkin";
export type DietType = "Keto" | "Vegetarian" | "Vegan" | "Non-Vegetarian" | "Gluten-Free" | "Halal" | "Kosher";

export interface Deal {
  id: string;
  title: string;
  discountType: DiscountType;
  discountValue: string;
  description: string;
  terms: string;
  startDate: string;    // ISO date string
  endDate: string;      // ISO date string
  orderTill: string;    // ISO datetime string
  deliveryTime: string; // ISO datetime string
  imageUrl: string;
  price: number;
  quantityLeft: number;
  includes: string[];
  dietType?: DietType;
  restaurant: {
    name: string;
    logoUrl: string;
    address: string;
    location: string;   // "City, State"
    phone: string;
    websiteUrl?: string;
    cuisineTag: string;
    rating: number;
    itemCount: number;
  };
}
