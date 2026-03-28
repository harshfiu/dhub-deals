-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "deliveryTime" TIMESTAMP(3),
ADD COLUMN     "dietType" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "includes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "orderTill" TIMESTAMP(3),
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quantityLeft" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "cuisineTag" TEXT,
ADD COLUMN     "itemCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "websiteUrl" TEXT;
