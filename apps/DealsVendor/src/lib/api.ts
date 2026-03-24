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

// ── Types — match mockData.ts exactly so DealCard works ────

export type DealStatus   = "Active" | "Scheduled" | "Expired";
export type DiscountType = "percentage" | "flat" | "bogo";

// This matches the Deal interface in mockData.ts exactly
export interface Deal {
  id:              number;
  title:           string;
  discountType:    DiscountType;
  discountValue:   number;
  discountDetails: string;
  status:          DealStatus;
  expiry:          string;
  views:           number;
  redemptions:     number;
  clicks:          number;
  // Extra fields from API (not used by DealCard but good to keep)
  _id:             string;   // original string id from API
  description:     string;
  terms:           string;
  startDate:       string;
  endDate:         string;
}

export interface Vendor {
  id:             string;
  email:          string;
  restaurantName: string;
  logoUrl:        string | null;
}

export type CreateDealPayload = {
  title:         string;
  description:   string;
  terms?:        string;
  discountType:  DiscountType;
  discountValue: number;
  startDate:     string;
  endDate:       string;
};

// ── Helpers ────────────────────────────────────────────────

// Formats the expiry string the same way mockData does: "Apr 15, 2026"
function formatExpiry(endDate: string, status: DealStatus, startDate: string): string {
  const date = new Date(status === "Scheduled" ? startDate : endDate);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return status === "Scheduled" ? `Starts ${formatted}` : formatted;
}

// Builds the discountDetails string the same way mockData does
function buildDiscountDetails(type: DiscountType, value: number, title: string): string {
  if (type === "percentage") return `${value}% off — ${title}`;
  if (type === "flat")       return `$${value} off — ${title}`;
  return title;
}

// Maps the raw API deal to the shape DealCard expects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDeal(d: any, index: number): Deal {
  const status: DealStatus = d.status;
  return {
    id:              index,                         // DealCard uses id % colors.length for color
    _id:             d.id,                          // keep original string id for API calls
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
    views:           d.views        ?? 0,
    clicks:          d.clicks       ?? 0,
    redemptions:     d.redemptions  ?? 0,
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
  email: string, password: string, restaurantName: string, logoUrl?: string
): Promise<Vendor> {
  const data = await apiFetch<{ token: string; vendor: Vendor }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, restaurantName, logoUrl }),
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
  const data = await apiFetch<{ deals: any[] }>("/api/deals");
  return data.deals.map(mapDeal);
}

export async function fetchDealById(id: string): Promise<Deal> {
  const data = await apiFetch<{ deal: any }>(`/api/deals/${id}`);
  return mapDeal(data.deal, 0);
}

export async function createDeal(payload: CreateDealPayload): Promise<Deal> {
  const data = await apiFetch<{ deal: any }>("/api/deals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapDeal(data.deal, 0);
}

export async function updateDeal(id: string, payload: Partial<CreateDealPayload>): Promise<Deal> {
  const data = await apiFetch<{ deal: any }>(`/api/deals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return mapDeal(data.deal, 0);
}

export async function deleteDeal(id: string): Promise<void> {
  await apiFetch(`/api/deals/${id}`, { method: "DELETE" });
}

export async function fetchDealStats(id: string) {
  const data = await apiFetch<{ stats: any }>(`/api/deals/${id}/stats`);
  return data.stats;
}