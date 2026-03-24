"use client";

import Image from "next/image";
import { Deal } from "@/types/deal";
import { useState } from "react";

// ── helpers ────────────────────────────────────────────────────────────────

function daysUntilExpiry(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ endDate }: { endDate: string }) {
  const days = daysUntilExpiry(endDate);
  if (days <= 0) return <span className="text-xs text-red-500 font-semibold">Expired</span>;
  if (days === 1) return <span className="text-xs text-red-500 font-semibold">Ends today!</span>;
  if (days <= 3)
    return <span className="text-xs font-semibold" style={{ color: "#f5a623" }}>Ends in {days} days</span>;
  return (
    <span className="text-xs text-gray-400 font-medium">
      Valid until {new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
    </span>
  );
}

function DiscountBadge({ type, value }: { type: Deal["discountType"]; value: string }) {
  const colours: Record<Deal["discountType"], string> = {
    percentage: "bg-[#2DBCB0] text-white",
    flat:       "bg-[#2DBCB0] text-white",
    bogo:       "bg-[#f5a623] text-white",
  };
  return (
    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow ${colours[type]}`}>
      {value}
    </span>
  );
}

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" style={{ color: "#f5a623" }} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function DirectionsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

// ── main component ─────────────────────────────────────────────────────────

export default function DealCard({ deal }: { deal: Deal }) {
  const [expanded, setExpanded] = useState(false);
  const hasWebsite = Boolean(deal.restaurant.websiteUrl);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_0_rgba(0,0,0,0.07)] hover:shadow-[0_6px_24px_0_rgba(0,0,0,0.12)] transition-shadow duration-200 flex flex-col">
      {/* ── Image ────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/9] flex-shrink-0">
        <Image
          src={deal.imageUrl}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <DiscountBadge type={deal.discountType} value={deal.discountValue} />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
          {deal.restaurant.cuisineTag}
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title + expiry */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-800 leading-tight">{deal.title}</h3>
          <ExpiryBadge endDate={deal.endDate} />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{deal.description}</p>

        {/* Restaurant row */}
        <div className="flex items-center gap-2.5 py-2.5 border-t border-b border-gray-100">
          <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
            <Image
              src={deal.restaurant.logoUrl}
              alt={deal.restaurant.name}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate">{deal.restaurant.name}</p>
            <p className="text-xs text-gray-400 truncate">{deal.restaurant.address}</p>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <StarIcon />
            <span className="text-xs font-semibold text-gray-700">{deal.restaurant.rating}</span>
          </div>
        </div>

        {/* Terms collapsible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-left text-xs font-medium hover:underline focus:outline-none"
          style={{ color: "#2DBCB0" }}
        >
          {expanded ? "Hide terms ↑" : "View terms & conditions ↓"}
        </button>
        {expanded && (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
            {deal.terms}
          </p>
        )}

        {/* CTA buttons */}
        <div className="mt-auto pt-1 flex flex-col gap-2">
          <div className="flex gap-2">
            {hasWebsite ? (
              <a
                href={deal.restaurant.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold whitespace-nowrap transition-colors shadow-sm"
                style={{ backgroundColor: "#2DBCB0" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#25A89C")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2DBCB0")}
              >
                Order Now <ArrowRightIcon />
              </a>
            ) : (
              <a
                href={`tel:${deal.restaurant.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold whitespace-nowrap transition-colors shadow-sm"
                style={{ backgroundColor: "#2DBCB0" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#25A89C")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2DBCB0")}
              >
                <PhoneIcon /> Call Now
              </a>
            )}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(deal.restaurant.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-colors"
              style={{ borderColor: "#2DBCB0", color: "#2DBCB0" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#2DBCB0"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#2DBCB0"; }}
            >
              <DirectionsIcon />
              Directions
            </a>
          </div>

          <a
            href={`tel:${deal.restaurant.phone}`}
            className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-400 transition-colors"
            onMouseEnter={e => (e.currentTarget.style.color = "#2DBCB0")}
            onMouseLeave={e => (e.currentTarget.style.color = "")}
          >
            <PhoneIcon />
            {deal.restaurant.phone}
          </a>
        </div>
      </div>
    </article>
  );
}
