export type DealStatus = "Active" | "Scheduled" | "Expired";
export type DiscountType = "percentage" | "flat" | "bogo";

export interface Deal {
  id: number;
  title: string;
  discountType: DiscountType;
  discountValue: number;
  discountDetails: string;
  status: DealStatus;
  expiry: string;
  views: number;
  redemptions: number;
  clicks: number;
}

export const mockDeals: Deal[] = [
  {
    id: 0,
    title: "30% Off All Burgers",
    discountType: "percentage",
    discountValue: 30,
    discountDetails: "30% off on all burger orders",
    status: "Active",
    expiry: "Apr 15, 2026",
    views: 423,
    redemptions: 58,
    clicks: 134,
  },
  {
    id: 1,
    title: "Flat $5 Off Orders $20+",
    discountType: "flat",
    discountValue: 5,
    discountDetails: "$5 off on orders above $20",
    status: "Active",
    expiry: "Mar 31, 2026",
    views: 187,
    redemptions: 21,
    clicks: 67,
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Pizza",
    discountType: "bogo",
    discountValue: 0,
    discountDetails: "Buy one pizza, get one free",
    status: "Scheduled",
    expiry: "Starts Apr 1, 2026",
    views: 312,
    redemptions: 0,
    clicks: 33,
  },
  {
    id: 3,
    title: "20% Off Weekend Brunch",
    discountType: "percentage",
    discountValue: 20,
    discountDetails: "20% off on weekend brunch menu",
    status: "Expired",
    expiry: "Mar 1, 2026",
    views: 891,
    redemptions: 142,
    clicks: 310,
  },
];

export const dashboardStats = {
  activeDeals: 4,
  totalViews: "1.2k",
  clicksThisMonth: 234,
  redemptions: 89,
};
