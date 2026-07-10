/*
  Warnings:

  - You are about to drop the column `area` on the `Properties` table. All the data in the column will be lost.
  - Added the required column `size` to the `Properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Properties" DROP COLUMN "area",
ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "size" DOUBLE PRECISION NOT NULL;
