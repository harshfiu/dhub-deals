"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentVendor, logoutVendor } from "@/lib/api";
import type { Vendor } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [vendor,  setVendor]  = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved,   setSaved]   = useState(false);

  // Form state
  const [restaurantName, setRestaurantName] = useState("");
  const [email,          setEmail]          = useState("");
  const [logoUrl,        setLogoUrl]        = useState("");

  useEffect(() => {
    getCurrentVendor()
      .then((v) => {
        setVendor(v);
        setRestaurantName(v.restaurantName);
        setEmail(v.email);
        setLogoUrl(v.logoUrl ?? "");
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    logoutVendor();
    router.push("/login");
  }

  // Profile save is UI-only for now (no PATCH /vendor endpoint yet)
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <p className="text-gray-400 text-sm p-4">Loading settings…</p>;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and restaurant profile</p>
      </div>

      {/* Profile section */}
      <Section title="Restaurant Profile">
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Restaurant Name">
            <input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="input"
              placeholder="Your restaurant name"
            />
          </Field>

          <Field label="Email Address">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </Field>

          <Field label="Logo URL">
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="input"
              placeholder="https://example.com/logo.png"
            />
          </Field>

          {/* Logo preview */}
          {logoUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Logo preview"
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <p className="text-xs text-gray-500">Logo preview</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#3E867A" }}
            >
              Save Changes
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 font-medium">✓ Saved!</span>
            )}
          </div>
        </form>
      </Section>

      {/* Account section */}
      <Section title="Account">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Vendor ID</p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{vendor?.id}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>
              <p className="text-xs text-gray-400 mt-0.5">Contact support to reset your password</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Session">
        <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-900">Sign out</p>
            <p className="text-xs text-gray-500 mt-0.5">You will need to log in again to access your dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
      </Section>

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
        .input:disabled { background: #f9fafb; color: #9ca3af; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}