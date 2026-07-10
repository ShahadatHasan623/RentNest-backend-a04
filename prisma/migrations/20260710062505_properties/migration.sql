-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "address" TEXT,
    "rent" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" DOUBLE PRECISION,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Properties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Properties" ADD CONSTRAINT "Properties_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
