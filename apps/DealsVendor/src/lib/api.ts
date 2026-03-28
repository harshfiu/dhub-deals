// ============================================================
// DealsVendor/src/lib/api.ts
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── Token helpers ──────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dhub_token");
}
export function setToken(token: string): void {
  localStorage.setItem("dhub_token", token);
}
export function clearToken(): void {
  localStorage.removeItem("dhub_token");
}

// ── Base fetch ─────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// ── Types ──────────────────────────────────────────────────

export type DealStatus   = "Active" | "Scheduled" | "Expired";
export type DiscountType = "percentage" | "flat" | "bogo";

export interface Deal {
  id:              number;    // numeric index for card color cycling
  _id:             string;    // real API string ID — use for all API calls
  title:           string;
  description:     string;
  terms:           string;
  discountType:    DiscountType;
  discountValue:   number;
  discountDetails: string;
  status:          DealStatus;
  expiry:          string;
  startDate:       string;
  endDate:         string;
  orderTill:       string;
  deliveryTime:    string;
  imageUrl:        string;
  price:           number;
  quantityLeft:    number;
  includes:        string[];
  dietType:        string | null;
  tags:            string[];
  views:           number;
  clicks:          number;
  redemptions:     number;
}

export interface Vendor {
  id:             string;
  email:          string;
  restaurantName: string;
  logoUrl:        string | null;
  address:        string | null;
  location:       string | null;
  phone:          string | null;
  websiteUrl:     string | null;
  cuisineTag:     string | null;
  rating:         number;
  itemCount:      number;
}

export type CreateDealPayload = {
  title:         string;
  description:   string;
  terms?:        string;
  discountType:  DiscountType;
  discountValue: number;
  startDate:     string;
  endDate:       string;
  orderTill?:    string;
  deliveryTime?: string;
  imageUrl?:     string;
  price?:        number;
  quantityLeft?: number;
  includes?:     string[];
  dietType?:     string;
  tags?:         string[];
};

export type UpdateVendorPayload = {
  restaurantName?: string;
  logoUrl?:        string;
  address?:        string;
  location?:       string;
  phone?:          string;
  websiteUrl?:     string;
  cuisineTag?:     string;
};

// ── Helpers ────────────────────────────────────────────────

function formatExpiry(endDate: string, status: DealStatus, startDate: string): string {
  const date = new Date(status === "Scheduled" ? startDate : endDate);
  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return status === "Scheduled" ? `Starts ${formatted}` : formatted;
}

function buildDiscountDetails(type: DiscountType, value: number, title: string): string {
  if (type === "percentage") return `${value}% off — ${title}`;
  if (type === "flat")       return `$${value} off — ${title}`;
  return title;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDeal(d: any, index: number): Deal {
  const status: DealStatus = d.status;
  return {
    id:              index,
    _id:             d.id,
    title:           d.title,
    description:     d.description   ?? "",
    terms:           d.terms         ?? "",
    discountType:    d.discountType,
    discountValue:   d.discountValue,
    discountDetails: buildDiscountDetails(d.discountType, d.discountValue, d.title),
    status,
    expiry:          formatExpiry(d.endDate, status, d.startDate),
    startDate:       d.startDate,
    endDate:         d.endDate,
    orderTill:       d.orderTill     ?? d.endDate,
    deliveryTime:    d.deliveryTime  ?? d.endDate,
    imageUrl:        d.imageUrl      ?? "",
    price:           d.price         ?? 0,
    quantityLeft:    d.quantityLeft  ?? 0,
    includes:        d.includes      ?? [],
    dietType:        d.dietType      ?? null,
    tags:            d.tags          ?? [],
    views:           d.views         ?? 0,
    clicks:          d.clicks        ?? 0,
    redemptions:     d.redemptions   ?? 0,
  };
}

// ── Auth ───────────────────────────────────────────────────

export async function loginVendor(email: string, password: string): Promise<Vendor> {
  const data = await apiFetch<{ token: string; vendor: Vendor }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.vendor;
}

export async function signupVendor(
  email: string, password: string, restaurantName: string,
  extras?: Partial<UpdateVendorPayload>
): Promise<Vendor> {
  const data = await apiFetch<{ token: string; vendor: Vendor }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, restaurantName, ...extras }),
  });
  setToken(data.token);
  return data.vendor;
}

export async function getCurrentVendor(): Promise<Vendor> {
  const data = await apiFetch<{ vendor: Vendor }>("/api/auth/me");
  return data.vendor;
}

export function logoutVendor(): void {
  clearToken();
}

// ── Deals ──────────────────────────────────────────────────

export async function fetchMyDeals(): Promise<Deal[]> {
  const data = await apiFetch<{ deals: unknown[] }>("/api/deals");
  return (data.deals as any[]).map(mapDeal);
}

export async function fetchDealById(id: string): Promise<Deal> {
  const data = await apiFetch<{ deal: unknown }>(`/api/deals/${id}`);
  return mapDeal(data.deal, 0);
}

export async function createDeal(payload: CreateDealPayload): Promise<Deal> {
  const data = await apiFetch<{ deal: unknown }>("/api/deals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapDeal(data.deal, 0);
}

export async function updateDeal(id: string, payload: Partial<CreateDealPayload>): Promise<Deal> {
  const data = await apiFetch<{ deal: unknown }>(`/api/deals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return mapDeal(data.deal, 0);
}

export async function deleteDeal(id: string): Promise<void> {
  await apiFetch(`/api/deals/${id}`, { method: "DELETE" });
}

export async function fetchDealStats(id: string) {
  const data = await apiFetch<{ stats: unknown }>(`/api/deals/${id}/stats`);
  return data.stats;
}