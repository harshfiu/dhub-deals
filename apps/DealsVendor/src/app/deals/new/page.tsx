"use client";

import { useState } from "react";
import Link from "next/link";

type DiscountType = "percentage" | "flat" | "bogo";

interface FormData {
  title: string;
  discountType: DiscountType;
  discountValue: string;
  originalPrice: string;
  validFrom: string;
  validUntil: string;
  terms: string;
  maxRedemptions: string;
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function TagPreviewIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9.414V5a2 2 0 012-2z" />
    </svg>
  );
}

const discountTypeOptions: { value: DiscountType; label: string }[] = [
  { value: "percentage", label: "% Off" },
  { value: "flat", label: "Flat Off" },
  { value: "bogo", label: "BOGO" },
];

function buildDiscountBadge(form: FormData): string {
  if (form.discountType === "percentage" && form.discountValue)
    return `${form.discountValue}% OFF`;
  if (form.discountType === "flat" && form.discountValue)
    return `$${form.discountValue} OFF`;
  if (form.discountType === "bogo") return "Buy 1 Get 1";
  return "Your Discount";
}

function buildDiscountDetail(form: FormData): string {
  if (form.discountType === "percentage" && form.discountValue)
    return `${form.discountValue}% off on your order`;
  if (form.discountType === "flat" && form.discountValue)
    return `Flat $${form.discountValue} off on orders`;
  if (form.discountType === "bogo") return "Buy 1 item, get 1 free";
  return "Discount details will appear here";
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
      style={{ "--tw-ring-color": "#3E867A" } as React.CSSProperties}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#3E867A")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
    />
  );
}

export default function NewDealPage() {
  const [form, setForm] = useState<FormData>({
    title: "",
    discountType: "percentage",
    discountValue: "",
    originalPrice: "",
    validFrom: "",
    validUntil: "",
    terms: "",
    maxRedemptions: "",
  });

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert("Deal created successfully! (mock)");
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-3"
        >
          <BackArrowIcon />
          Back to Deals
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Deal</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to publish a new deal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ---- Left: Form ---- */}
          <div className="lg:col-span-3 space-y-5">
            {/* Deal Title */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-500">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <InputLabel>Deal Title *</InputLabel>
                  <TextInput
                    placeholder="e.g. 30% Off All Burgers"
                    value={form.title}
                    onChange={(v) => setField("title", v)}
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <InputLabel>Discount Type *</InputLabel>
                  <div className="flex gap-2 flex-wrap">
                    {discountTypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField("discountType", opt.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          form.discountType === opt.value
                            ? "text-white border-transparent"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#3E867A] hover:text-[#3E867A]"
                        }`}
                        style={
                          form.discountType === opt.value
                            ? { backgroundColor: "#3E867A" }
                            : {}
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Value (hidden for BOGO) */}
                {form.discountType !== "bogo" && (
                  <div>
                    <InputLabel>
                      Discount Value *{" "}
                      <span className="text-gray-400 font-normal">
                        ({form.discountType === "percentage" ? "%" : "$"})
                      </span>
                    </InputLabel>
                    <TextInput
                      type="number"
                      placeholder={
                        form.discountType === "percentage"
                          ? "e.g. 30"
                          : "e.g. 5"
                      }
                      value={form.discountValue}
                      onChange={(v) => setField("discountValue", v)}
                    />
                  </div>
                )}

                {/* Original Price */}
                <div>
                  <InputLabel>
                    Original Price{" "}
                    <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </InputLabel>
                  <TextInput
                    type="number"
                    placeholder="e.g. 25.00"
                    value={form.originalPrice}
                    onChange={(v) => setField("originalPrice", v)}
                  />
                </div>
              </div>
            </div>

            {/* Validity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">
                Validity Period
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <InputLabel>Valid From *</InputLabel>
                  <TextInput
                    type="date"
                    value={form.validFrom}
                    onChange={(v) => setField("validFrom", v)}
                  />
                </div>
                <div>
                  <InputLabel>Valid Until *</InputLabel>
                  <TextInput
                    type="date"
                    value={form.validUntil}
                    onChange={(v) => setField("validUntil", v)}
                  />
                </div>
              </div>
            </div>

            {/* Terms & Max Redemptions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">
                Additional Details
              </h2>

              <div className="space-y-4">
                <div>
                  <InputLabel>Terms &amp; Conditions</InputLabel>
                  <textarea
                    rows={4}
                    placeholder="e.g. Valid on dine-in orders only. Cannot be combined with other offers."
                    value={form.terms}
                    onChange={(e) => setField("terms", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none transition-all"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#3E867A")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                  />
                </div>

                <div>
                  <InputLabel>
                    Max Redemptions{" "}
                    <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </InputLabel>
                  <TextInput
                    type="number"
                    placeholder="e.g. 100 (leave blank for unlimited)"
                    value={form.maxRedemptions}
                    onChange={(v) => setField("maxRedemptions", v)}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 justify-end pt-2">
              <Link
                href="/deals"
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#3E867A" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d6b60")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3E867A")
                }
              >
                Create Deal
              </button>
            </div>
          </div>

          {/* ---- Right: Live Preview ---- */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">
                  Live Preview
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  This is how your deal will appear to customers on DHub.
                </p>

                {/* Preview card */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  {/* Card top */}
                  <div
                    className="relative h-36 flex items-center justify-center"
                    style={{ backgroundColor: "#1a3a5c" }}
                  >
                    {/* Decorative circles */}
                    <div
                      className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
                      style={{ backgroundColor: "#1e4570" }}
                    />
                    <div
                      className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20"
                      style={{ backgroundColor: "#1e4570" }}
                    />

                    {form.title || form.discountType === "bogo" || form.discountValue ? (
                      <span
                        className="relative z-10 px-5 py-2.5 rounded-full text-white font-bold text-xl tracking-wide"
                        style={{ backgroundColor: "#EF9D39" }}
                      >
                        {buildDiscountBadge(form)}
                      </span>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center gap-2 text-white/40">
                        <TagPreviewIcon />
                        <span className="text-xs">Your discount badge</span>
                      </div>
                    )}

                    {/* Status */}
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4 space-y-2">
                    <p className="font-semibold text-gray-900 text-sm">
                      {form.title || (
                        <span className="text-gray-300">Deal title will appear here</span>
                      )}
                    </p>

                    <p className="text-xs text-gray-500">{buildDiscountDetail(form)}</p>

                    {form.validUntil && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Expires:{" "}
                        {new Date(form.validUntil).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    )}

                    {form.terms && (
                      <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-2 mt-2">
                        {form.terms.slice(0, 80)}
                        {form.terms.length > 80 ? "…" : ""}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        className="w-full py-2 rounded-xl text-white text-sm font-semibold"
                        style={{ backgroundColor: "#3E867A" }}
                      >
                        Redeem Deal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tip */}
                <div className="mt-4 p-3 rounded-xl bg-[#e8f4f2] text-xs text-[#3E867A] font-medium">
                  Fill in the form on the left and watch your deal come to life here in real time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
