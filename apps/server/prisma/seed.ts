// ============================================================
// prisma/seed.ts
// ============================================================
// Seeds the database with demo data that matches the shape of
// the mock data your colleague put in:
//   DealsCustomer/src/data/deals.ts
//   DealsVendor/src/lib/mockData.ts
//
// Run with: npm run db:seed
// Safe to re-run — wipes and recreates each time.
// ============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.deal.deleteMany();
  await prisma.vendor.deleteMany();

  const vendor = await prisma.vendor.create({
    data: {
      email: 'demo@dhubdeals.com',
      password: await bcrypt.hash('password123', 10),
      restaurantName: 'The Demo Kitchen',
      logoUrl: 'https://placehold.co/100x100/orange/white?text=DK',
    },
  });
  console.log(`✅ Vendor: ${vendor.email}`);

  const now = new Date();
  const { count } = await prisma.deal.createMany({
    data: [
      {
        vendorId:      vendor.id,
        title:         '20% Off Your Entire Order',
        description:   'Enjoy a 20% discount on everything on our menu this weekend!',
        terms:         'Valid dine-in only. Cannot be combined with other offers.',
        discountType:  'percentage',
        discountValue: 20,
        startDate:     new Date(now.getTime() - 1  * 86400000), // yesterday
        endDate:       new Date(now.getTime() + 7  * 86400000), // 7 days ahead
        status:       'flat',
        views: 142, clicks: 58, redemptions: 23,
      },
      {
        vendorId:      vendor.id,
        title:         'Buy One Get One Free Burgers',
        description:   'Order any burger and get a second one absolutely free!',
        terms:         'Valid Mon–Thu only. Second item must be of equal or lesser value.',
        discountType:  'bogo',
        discountValue: 0,
        startDate:     new Date(now.getTime() + 2  * 86400000),
        endDate:       new Date(now.getTime() + 14 * 86400000),
        status:        'Scheduled',
        views: 0, clicks: 0, redemptions: 0,
      },
      {
        vendorId:      vendor.id,
        title:         '$5 Off Orders Over $25',
        description:   'Get $5 off when you spend $25 or more.',
        discountType:  'flat',
        discountValue: 5,
        startDate:     new Date(now.getTime() - 30 * 86400000),
        endDate:       new Date(now.getTime() - 1  * 86400000), // expired
        status:        'Expired',
        views: 320, clicks: 110, redemptions: 67,
      },
    ],
  });

  console.log(`✅ ${count} deals created`);
  console.log('\n🎉 Done!');
  console.log('   Login → demo@dhubdeals.com / password123');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });