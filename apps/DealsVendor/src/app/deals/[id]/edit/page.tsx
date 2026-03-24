"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchDealById, updateDeal } from "@/lib/api";
import type { CreateDealPayload } from "@/lib/api";

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage off (e.g. 20% off)" },
  { value: "flat",       label: "Flat amount off (e.g. $5 off)" },
  { value: "bogo",       label: "Buy One Get One" },
] as const;

export default function EditDealPage() {
  const router   = useRouter();
  const params   = useParams();
  const id       = params.id as string;

  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [form, setForm] = useState<CreateDealPayload>({
    title:         "",
    description:   "",
    terms:         "",
    discountType:  "percentage",
    discountValue: 0,
    startDate:     "",
    endDate:       "",
  });

  // Load existing deal on mount
  useEffect(() => {
    fetchDealById(id)
      .then((deal) => {
        // Convert ISO dates back to datetime-local format
        const toLocal = (iso: string) =>
          new Date(iso).toISOString().slice(0, 16);

        setForm({
          title:         deal.title,
          description:   deal.description,
          terms:         deal.terms ?? "",
          discountType:  deal.discountType,
          discountValue: deal.discountValue,
          startDate:     toLocal(deal.startDate),
          endDate:       toLocal(deal.endDate),
        });
      })
      .catch(() => setError("Failed to load deal."))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "discountValue" ? parseFloat(value) || 0 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateDeal(id, {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate:   new Date(form.endDate).toISOString(),
        terms:     form.terms?.trim() || undefined,
      });
      router.push("/deals");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-400 text-sm p-4">Loading deal…</p>;

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input
            name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. 20% Off This Weekend"
            className="input" required
          />
        </Field>

        <Field label="Description" required>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="What does this deal offer?"
            rows={3} className="input" required
          />
        </Field>

        <Field label="Terms & Conditions">
          <textarea
            name="terms" value={form.terms} onChange={handleChange}
            placeholder="Any restrictions or conditions? (optional)"
            rows={2} className="input"
          />
        </Field>

        <Field label="Discount Type" required>
          <select
            name="discountType" value={form.discountType}
            onChange={handleChange} className="input"
          >
            {DISCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        {form.discountType !== "bogo" && (
          <Field
            label={form.discountType === "percentage" ? "Discount %" : "Discount Amount ($)"}
            required
          >
            <input
              type="number" name="discountValue" value={form.discountValue}
              onChange={handleChange} min={0} step={0.01} className="input" required
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date" required>
            <input
              type="datetime-local" name="startDate" value={form.startDate}
              onChange={handleChange} className="input" required
            />
          </Field>
          <Field label="End Date" required>
            <input
              type="datetime-local" name="endDate" value={form.endDate}
              onChange={handleChange} className="input" required
            />
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-colors"
            style={{ backgroundColor: "#3E867A" }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx global>{`
        .input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        .input:focus { border-color: #3E867A; }
      `}</style>
    </div>
  );
}

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}