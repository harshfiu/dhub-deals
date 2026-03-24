"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyDeals, deleteDeal, getCurrentVendor, logoutVendor } from "@/lib/api";
import type { Deal, Vendor } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [vendor,  setVendor]  = useState<Vendor | null>(null);
  const [deals,   setDeals]   = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [currentVendor, myDeals] = await Promise.all([
          getCurrentVendor(),
          fetchMyDeals(),
        ]);
        setVendor(currentVendor);
        setDeals(myDeals);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this deal? This cannot be undone.")) return;
    try {
      await deleteDeal(id);
      setDeals((prev) => prev.filter((d) => d._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleLogout() {
    logoutVendor();
    router.push("/login");
  }

  if (loading) return <p className="p-8 text-center text-gray-400">Loading…</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{vendor?.restaurantName}</h1>
          <p className="text-sm text-gray-500">{vendor?.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/deals/new")}
            className="text-white px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "#3E867A" }}
          >
            + New Deal
          </button>
          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded-lg text-sm text-gray-600"
          >
            Log out
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Total Deals"   value={deals.length} />
        <SummaryCard label="Active"        value={deals.filter((d) => d.status === "Active").length} />
        <SummaryCard label="Total Views"   value={deals.reduce((s, d) => s + d.views, 0)} />
        <SummaryCard label="Redemptions"   value={deals.reduce((s, d) => s + d.redemptions, 0)} />
      </div>

      {/* Deals list */}
      {deals.length === 0 ? (
        <p className="text-gray-400 text-center py-16">
          No deals yet.{" "}
          <button onClick={() => router.push("/deals/new")} className="underline">
            Create your first one.
          </button>
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Your Deals</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {deals.map((deal) => (
              <div key={deal._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{deal.title}</span>
                    <StatusBadge status={deal.status} />
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {deal.discountDetails} · {deal.views} views · {deal.clicks} clicks · {deal.redemptions} redeemed
                  </p>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => router.push(`/deals/${deal._id}/edit`)}
                    className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:border-[#3E867A] hover:text-[#3E867A] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(deal._id)}
                    className="text-sm border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Deal["status"] }) {
  const styles = {
    Active:    "bg-emerald-100 text-emerald-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Expired:   "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}