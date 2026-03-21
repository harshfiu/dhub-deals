export type DiscountType = "percentage" | "flat" | "bogo";
export type AvailPath = "website" | "phone" | "walkin";

export interface Deal {
  id: string;
  title: string;
  discountType: DiscountType;
  discountValue: string; // e.g. "20%", "$5 off", "Buy 1 Get 1"
  description: string;
  terms: string;
  startDate: string;   // ISO date string
  endDate: string;     // ISO date string
  imageUrl: string;
  restaurant: {
    name: string;
    logoUrl: string;
    address: string;
    phone: string;
    websiteUrl?: string;      // present for Path A
    cuisineTag: string;
    rating: number;
  };
}
