// ============================================================
// DealsCustomer/src/app/page.tsx  ← UPDATE to this
// ============================================================
// Before: imported static deals from data/deals.ts
// After:  async Server Component — fetches from the API
//
// No changes needed in HeroSection.tsx or DealsSection.tsx.
// ============================================================

import HeroSection   from '@/components/HeroSection';
import DealsSection  from '@/components/DealsSection';
import { getDeals }  from '@/data/deals';

export default async function HomePage() {
  // Runs on the server — the browser never calls the API directly.
  // Next.js caches this and revalidates every 60 seconds (see deals.ts).
  const deals = await getDeals();

  return (
    <main>
      <HeroSection />
      <DealsSection deals={deals} />
    </main>
  );
}