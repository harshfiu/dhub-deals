"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyDeals, deleteDeal, getCurrentVendor, logoutVendor } from "@/lib/api";
import type { Deal, Vendor } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [vendor, setVendor]   = useState<Vendor | null>(null);
  const [deals, setDeals]     = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

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
        // No token or expired — go to login, don't loop
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
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{vendor?.restaurantName}</h1>
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
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Log out
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      {deals.length === 0 ? (
        <p className="text-gray-400 text-center py-16">
          No deals yet.{" "}
          <button onClick={() => router.push("/deals/new")} className="underline">
            Create your first one.
          </button>
        </p>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => (
            <div key={deal.id} className="border rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{deal.title}</span>
                  <StatusBadge status={deal.status} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {deal.discountType === "percentage" && `${deal.discountValue}% off`}
                  {deal.discountType === "flat"       && `$${deal.discountValue} off`}
                  {deal.discountType === "bogo"       && "Buy One Get One"}
                  {" · "}
                  {deal.views} views · {deal.clicks} clicks · {deal.redemptions} redeemed
                </p>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button
                  onClick={() => router.push(`/deals/${deal.id}/edit`)}
                  className="text-sm border px-3 py-1.5 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(deal._id)}
                  className="text-sm border border-red-200 text-red-600 px-3 py-1.5 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: Deal["status"] }) {
  const styles = {
    Active:    "bg-green-100 text-green-700",
    Scheduled: "bg-yellow-100 text-yellow-700",
    Expired:   "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}