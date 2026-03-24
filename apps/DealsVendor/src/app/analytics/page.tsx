"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyDeals } from "@/lib/api";
import type { Deal } from "@/lib/api";

export default function AnalyticsPage() {
  const router = useRouter();
  const [deals,   setDeals]   = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDeals()
      .then(setDeals)
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p className="text-gray-400 text-sm p-4">Loading analytics…</p>;

  // Aggregate stats across all deals
  const totalViews       = deals.reduce((s, d) => s + d.views,       0);
  const totalClicks      = deals.reduce((s, d) => s + d.clicks,      0);
  const totalRedemptions = deals.reduce((s, d) => s + d.redemptions, 0);
  const activeDeals      = deals.filter((d) => d.status === "Active").length;
  const clickRate        = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
  const redeemRate       = totalClicks > 0 ? ((totalRedemptions / totalClicks) * 100).toFixed(1) : "0.0";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Performance overview across all your deals</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Views"       value={totalViews.toLocaleString()}       sub="across all deals"    color="#3E867A" />
        <StatCard label="Total Clicks"      value={totalClicks.toLocaleString()}      sub={`${clickRate}% click rate`}   color="#4F86C6" />
        <StatCard label="Redemptions"       value={totalRedemptions.toLocaleString()} sub={`${redeemRate}% redeem rate`} color="#EF9D39" />
        <StatCard label="Active Deals"      value={String(activeDeals)}               sub={`of ${deals.length} total`}   color="#7C5CBF" />
      </div>

      {/* Per-deal breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Deal Breakdown</h2>
        </div>

        {deals.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No deals yet. Create one to start tracking analytics.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-6 py-3 text-left font-medium">Deal</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Views</th>
                <th className="px-6 py-3 text-right font-medium">Clicks</th>
                <th className="px-6 py-3 text-right font-medium">Redeemed</th>
                <th className="px-6 py-3 text-right font-medium">Click Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map((deal) => {
                const cr = deal.views > 0
                  ? ((deal.clicks / deal.views) * 100).toFixed(1)
                  : "0.0";
                return (
                  <tr key={deal._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 truncate max-w-[200px]">{deal.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{deal.discountDetails}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={deal.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">{deal.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{deal.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{deal.redemptions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-700">{cr}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, color,
}: {
  label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
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