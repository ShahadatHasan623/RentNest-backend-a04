/*
  Warnings:

  - Added the required column `duration` to the `RentalRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landlordId` to the `RentalRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentalRequest" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "landlordId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RentalRequest" ADD CONSTRAINT "RentalRequest_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
