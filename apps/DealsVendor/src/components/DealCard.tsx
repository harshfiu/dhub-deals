"use client";

import { useState } from "react";
import { Deal } from "@/lib/mockData";

interface DealCardProps {
  deal: Deal;
}

// Deterministic color palette for card header backgrounds
const cardColors = [
  { bg: "#1a3a5c", pattern: "#1e4570" },
  { bg: "#2d4a22", pattern: "#345528" },
  { bg: "#4a2020", pattern: "#562525" },
  { bg: "#2a2050", pattern: "#31275c" },
];

function EditIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

const statusConfig = {
  Active: { label: "Active", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Scheduled: { label: "Scheduled", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  Expired: { label: "Expired", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

function discountLabel(deal: Deal): string {
  if (deal.discountType === "percentage") return `${deal.discountValue}% OFF`;
  if (deal.discountType === "flat") return `$${deal.discountValue} OFF`;
  return "BOGO";
}

export default function DealCard({ deal }: DealCardProps) {
  const [isActive, setIsActive] = useState(deal.status === "Active");
  const colorIndex = deal.id % cardColors.length;
  const color = cardColors[colorIndex];
  const status = statusConfig[deal.status];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Card header with colored background */}
      <div
        className="relative h-32 flex items-center justify-center"
        style={{ backgroundColor: color.bg }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
          style={{ backgroundColor: color.pattern }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20"
          style={{ backgroundColor: color.pattern }}
        />

        {/* Discount badge */}
        <span
          className="relative z-10 px-4 py-2 rounded-full text-white font-bold text-lg tracking-wide"
          style={{ backgroundColor: "#EF9D39" }}
        >
          {discountLabel(deal)}
        </span>

        {/* Status badge top-right */}
        <span
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{deal.title}</h3>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9.414V5a2 2 0 012-2z" />
          </svg>
          <span>{deal.discountDetails}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {deal.status === "Expired" ? "Expired" : "Expires"}: {deal.expiry}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <EyeIcon />
          <span>{deal.views.toLocaleString()} views</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
            style={{ backgroundColor: "#3E867A" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2d6b60")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3E867A")}
          >
            <EditIcon />
            Edit
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full inline-block ${
                isActive ? "bg-gray-400" : "bg-emerald-500"
              }`}
            />
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
