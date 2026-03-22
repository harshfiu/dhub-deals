// ============================================================
// DealsCustomer/src/data/deals.ts
// ============================================================

import type { Deal } from "@/types/deal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getDeals(): Promise<Deal[]> {
  try {
    const res = await fetch(`${API_URL}/api/deals/public`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch deals");

    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.deals.map((d: any): Deal => ({
      id:            d.id,
      title:         d.title,
      description:   d.description,
      terms:         d.terms ?? "",
      discountType:  d.discountType,
      discountValue:
        d.discountType === "percentage" ? `${d.discountValue}%` :
        d.discountType === "flat"       ? `$${d.discountValue} off` :
                                          "Buy 1 Get 1",
      startDate:  d.startDate,
      endDate:    d.endDate,
      imageUrl:   d.imageUrl ?? "https://placehold.co/600x300/e8f5e9/008000?text=Deal",
      restaurant: {
        name:       d.vendor?.restaurantName ?? "Restaurant",
        logoUrl:    d.vendor?.logoUrl        ?? "https://placehold.co/100x100/008000/white?text=R",
        address:    d.vendor?.address        ?? "123 Main St",
        phone:      d.vendor?.phone          ?? "555-0000",
        websiteUrl: d.vendor?.websiteUrl,
        cuisineTag: d.vendor?.cuisineTag     ?? "Food",
        rating:     d.vendor?.rating         ?? 4.5,
      },
    }));
  } catch (error) {
    console.error("getDeals error:", error);
    return [];
  }
}

export async function trackView(dealId: string) {
  await fetch(`${API_URL}/api/deals/${dealId}/stats/view`, { method: "POST" }).catch(() => {});
}

export async function trackClick(dealId: string) {
  await fetch(`${API_URL}/api/deals/${dealId}/stats/click`, { method: "POST" }).catch(() => {});
}

export async function trackRedemption(dealId: string) {
  await fetch(`${API_URL}/api/deals/${dealId}/stats/redeem`, { method: "POST" }).catch(() => {});
}