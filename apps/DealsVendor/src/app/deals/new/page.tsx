// ============================================================
// DealsVendor/src/app/deals/new/page.tsx  ← UPDATE to this
// ============================================================
// Before: pushed to local mockData state
// After:  POSTs to /api/deals and redirects on success
// ============================================================

'use client';

import { useState }    from 'react';
import { useRouter }   from 'next/navigation';
import { createDeal }  from '@/lib/api';
import type { CreateDealPayload } from '@/lib/api';

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage off (e.g. 20% off)' },
  { value: 'flat',       label: 'Flat amount off (e.g. $5 off)' },
  { value: 'bogo',       label: 'Buy One Get One' },
] as const;

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const [form, setForm] = useState<CreateDealPayload>({
    title:         '',
    description:   '',
    terms:         '',
    discountType:  'percentage',
    discountValue: 0,
    startDate:     '',
    endDate:       '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'discountValue' ? parseFloat(value) || 0 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert local date strings to ISO 8601 for the API
      const payload: CreateDealPayload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate:   new Date(form.endDate).toISOString(),
        // Don't send empty terms string
        terms: form.terms?.trim() || undefined,
      };

      await createDeal(payload);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-sm text-gray-500">
          ← Back
        </button>
        <h1 className="text-xl font-bold">New Deal</h1>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
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
          <select name="discountType" value={form.discountType} onChange={handleChange} className="input">
            {DISCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        {form.discountType !== 'bogo' && (
          <Field label={form.discountType === 'percentage' ? 'Discount %' : 'Discount Amount ($)'} required>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create Deal'}
        </button>
      </form>

      {/* Global input style — add this to globals.css if preferred */}
      <style jsx global>{`
        .input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus { border-color: #000; }
      `}</style>
    </main>
  );
}

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}