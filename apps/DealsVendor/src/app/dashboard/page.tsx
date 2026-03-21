"use client";

import StatsCard from "@/components/StatsCard";
import { mockDeals } from "@/lib/mockData";

function TagIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9.414V5a2 2 0 012-2z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function CursorClickIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Expired: "bg-gray-100 text-gray-500",
  };
  return map[status] ?? "bg-gray-100 text-gray-500";
};

export default function DashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your deals and performance</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Active Deals"
          value="4"
          icon={<TagIcon />}
          iconBg="#e8f4f2"
          iconColor="#3E867A"
          change="1 deal"
          changePositive={true}
        />
        <StatsCard
          label="Total Views"
          value="1.2k"
          icon={<EyeIcon />}
          iconBg="#fef3e2"
          iconColor="#EF9D39"
          change="8.2%"
          changePositive={true}
        />
        <StatsCard
          label="Clicks This Month"
          value="234"
          icon={<CursorClickIcon />}
          iconBg="#ede9fe"
          iconColor="#7c3aed"
          change="3.1%"
          changePositive={false}
        />
        <StatsCard
          label="Redemptions"
          value="89"
          icon={<CheckCircleIcon />}
          iconBg="#fee2e2"
          iconColor="#dc2626"
          change="12%"
          changePositive={true}
        />
      </div>

      {/* Recent Deals Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Deals</h2>
          <a
            href="/deals"
            className="text-sm font-medium transition-colors"
            style={{ color: "#3E867A" }}
          >
            View all →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  Deal Name
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                  Discount
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                  Expiry
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                  Views
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 text-sm">{deal.title}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#EF9D39" }}
                    >
                      {deal.discountType === "percentage"
                        ? `${deal.discountValue}% Off`
                        : deal.discountType === "flat"
                        ? `$${deal.discountValue} Off`
                        : "BOGO"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(deal.status)}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          deal.status === "Active"
                            ? "bg-emerald-500"
                            : deal.status === "Scheduled"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      />
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{deal.expiry}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                    {deal.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
                        style={{ backgroundColor: "#3E867A" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2d6b60")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3E867A")
                        }
                      >
                        Edit
                      </button>
                      <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
