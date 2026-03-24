"use client";

import { useState }   from "react";
import { useRouter }  from "next/navigation";
import { createDeal } from "@/lib/api";
import type { CreateDealPayload } from "@/lib/api";
import TagSelector from "@/components/TagSelector";

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage off (e.g. 20% off)" },
  { value: "flat",       label: "Flat amount off (e.g. $5 off)" },
  { value: "bogo",       label: "Buy One Get One" },
] as const;

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [tags,    setTags]    = useState<string[]>([]);

  const [form, setForm] = useState<CreateDealPayload>({
    title:         "",
    description:   "",
    terms:         "",
    discountType:  "percentage",
    discountValue: 0,
    startDate:     "",
    endDate:       "",
  });

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
    setLoading(true);
    setError(null);
    try {
      await createDeal({
        ...form,
        tags,
        startDate: new Date(form.startDate).toISOString(),
        endDate:   new Date(form.endDate).toISOString(),
        terms:     form.terms?.trim() || undefined,
      } as any);
      router.push("/deals");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">New Deal</h1>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. 20% Off This Weekend" className="input" required />
        </Field>

        <Field label="Description" required>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="What does this deal offer?" rows={3} className="input" required />
        </Field>

        <Field label="Terms & Conditions">
          <textarea name="terms" value={form.terms} onChange={handleChange}
            placeholder="Any restrictions or conditions? (optional)" rows={2} className="input" />
        </Field>

        <Field label="Discount Type" required>
          <select name="discountType" value={form.discountType} onChange={handleChange} className="input">
            {DISCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        {form.discountType !== "bogo" && (
          <Field label={form.discountType === "percentage" ? "Discount %" : "Discount Amount ($)"} required>
            <input type="number" name="discountValue" value={form.discountValue}
              onChange={handleChange} min={0} step={0.01} className="input" required />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date" required>
            <input type="datetime-local" name="startDate" value={form.startDate}
              onChange={handleChange} className="input" required />
          </Field>
          <Field label="End Date" required>
            <input type="datetime-local" name="endDate" value={form.endDate}
              onChange={handleChange} className="input" required />
          </Field>
        </div>

        {/* Tag selector */}
        <Field label="Tags" hint="Help customers find your deal (up to 10)">
          <TagSelector selectedTags={tags} onChange={setTags} maxTags={10} />
        </Field>

        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "#3E867A" }}
        >
          {loading ? "Creating…" : "Create Deal"}
        </button>
      </form>

      <style jsx global>{`
        .input { display:block; width:100%; padding:0.5rem 0.75rem; border:1px solid #e5e7eb; border-radius:0.5rem; font-size:0.875rem; outline:none; background:white; }
        .input:focus { border-color:#3E867A; }
      `}</style>
    </div>
  );
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1.5 text-xs">{hint}</span>}
      </label>
      {children}
    </div>
  );
}