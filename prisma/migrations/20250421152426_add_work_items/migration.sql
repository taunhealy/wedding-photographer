/*
  Warnings:

  - The values [CUSTOMER,GUIDE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `insuranceOption` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `tourScheduleId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `PaypalOrder` table. All the data in the column will be lost.
  - You are about to drop the column `tourId` on the `PaypalOrder` table. All the data in the column will be lost.
  - You are about to drop the column `tourHighlight` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `WaitlistEntry` table. All the data in the column will be lost.
  - You are about to drop the column `tourScheduleId` on the `WaitlistEntry` table. All the data in the column will be lost.
  - You are about to drop the `BookingEquipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentAvailability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentRental` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuideProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarineLife` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tour` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourAccommodation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourEquipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourItinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TourMarineLife` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TourTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `packageScheduleId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageId` to the `PaypalOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageScheduleId` to the `WaitlistEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CLIENT', 'ADMIN', 'STAFF');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tourScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "BookingEquipment" DROP CONSTRAINT "BookingEquipment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingEquipment" DROP CONSTRAINT "BookingEquipment_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerProfile" DROP CONSTRAINT "CustomerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentAvailability" DROP CONSTRAINT "EquipmentAvailability_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentAvailability" DROP CONSTRAINT "EquipmentAvailability_tourScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentRental" DROP CONSTRAINT "EquipmentRental_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "GuideProfile" DROP CONSTRAINT "GuideProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaypalOrder" DROP CONSTRAINT "PaypalOrder_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "PaypalOrder" DROP CONSTRAINT "PaypalOrder_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_endLocationId_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_guideId_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_startLocationId_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_tourTypeId_fkey";

-- DropForeignKey
ALTER TABLE "TourAccommodation" DROP CONSTRAINT "TourAccommodation_locationId_fkey";

-- DropForeignKey
ALTER TABLE "TourAccommodation" DROP CONSTRAINT "TourAccommodation_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourEquipment" DROP CONSTRAINT "TourEquipment_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "TourEquipment" DROP CONSTRAINT "TourEquipment_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourItinerary" DROP CONSTRAINT "TourItinerary_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourSchedule" DROP CONSTRAINT "TourSchedule_guideId_fkey";

-- DropForeignKey
ALTER TABLE "TourSchedule" DROP CONSTRAINT "TourSchedule_tourId_fkey";

-- DropForeignKey
ALTER TABLE "WaitlistEntry" DROP CONSTRAINT "WaitlistEntry_tourScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "_TourMarineLife" DROP CONSTRAINT "_TourMarineLife_A_fkey";

-- DropForeignKey
ALTER TABLE "_TourMarineLife" DROP CONSTRAINT "_TourMarineLife_B_fkey";

-- DropForeignKey
ALTER TABLE "_TourTags" DROP CONSTRAINT "_TourTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_TourTags" DROP CONSTRAINT "_TourTags_B_fkey";

-- DropIndex
DROP INDEX "PaypalOrder_tourId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "insuranceOption",
DROP COLUMN "participants",
DROP COLUMN "tourScheduleId",
ADD COLUMN     "packageScheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaypalOrder" DROP COLUMN "participants",
DROP COLUMN "tourId",
ADD COLUMN     "packageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "tourHighlight",
ADD COLUMN     "highlight" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emergencyContact",
ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "WaitlistEntry" DROP COLUMN "participants",
DROP COLUMN "tourScheduleId",
ADD COLUMN     "packageScheduleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "BookingEquipment";

-- DropTable
DROP TABLE "CustomerProfile";

-- DropTable
DROP TABLE "Equipment";

-- DropTable
DROP TABLE "EquipmentAvailability";

-- DropTable
DROP TABLE "EquipmentRental";

-- DropTable
DROP TABLE "GuideProfile";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "MarineLife";

-- DropTable
DROP TABLE "Tour";

-- DropTable
DROP TABLE "TourAccommodation";

-- DropTable
DROP TABLE "TourCategory";

-- DropTable
DROP TABLE "TourEquipment";

-- DropTable
DROP TABLE "TourItinerary";

-- DropTable
DROP TABLE "TourSchedule";

-- DropTable
DROP TABLE "TourType";

-- DropTable
DROP TABLE "_TourMarineLife";

-- DropTable
DROP TABLE "_TourTags";

-- DropEnum
DROP TYPE "DifficultyLevel";

-- DropEnum
DROP TYPE "ScheduleType";

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" MONEY NOT NULL,
    "images" TEXT[],
    "highlights" TEXT[],
    "inclusions" TEXT[],
    "exclusions" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "categoryId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSchedule" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "PackageSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDetails" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'WEDDING',
    "numberOfGuests" INTEGER,
    "additionalPhotographers" BOOLEAN NOT NULL DEFAULT false,
    "timeline" JSONB,
    "contactPersonName" TEXT,
    "contactPersonPhone" TEXT,

    CONSTRAINT "EventDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "anniversaryDate" TIMESTAMP(3),
    "preferredStyle" TEXT,
    "notes" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PackageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "coverImage" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "couple" TEXT,
    "venue" TEXT,
    "categoryId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PackageTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PackageTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WorkItemTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkItemTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventDetails_bookingId_key" ON "EventDetails"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageCategory_name_key" ON "PackageCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkItem_slug_key" ON "WorkItem"("slug");

-- CreateIndex
CREATE INDEX "WorkItem_categoryId_idx" ON "WorkItem"("categoryId");

-- CreateIndex
CREATE INDEX "WorkItem_published_idx" ON "WorkItem"("published");

-- CreateIndex
CREATE INDEX "WorkItem_featured_idx" ON "WorkItem"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCategory_name_key" ON "WorkCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCategory_slug_key" ON "WorkCategory"("slug");

-- CreateIndex
CREATE INDEX "WorkCategory_order_idx" ON "WorkCategory"("order");

-- CreateIndex
CREATE UNIQUE INDEX "WorkTag_name_key" ON "WorkTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkTag_slug_key" ON "WorkTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_date_startTime_endTime_key" ON "Availability"("date", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "_PackageTags_B_index" ON "_PackageTags"("B");

-- CreateIndex
CREATE INDEX "_WorkItemTags_B_index" ON "_WorkItemTags"("B");

-- CreateIndex
CREATE INDEX "PaypalOrder_packageId_idx" ON "PaypalOrder"("packageId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackageCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSchedule" ADD CONSTRAINT "PackageSchedule_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_packageScheduleId_fkey" FOREIGN KEY ("packageScheduleId") REFERENCES "PackageSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDetails" ADD CONSTRAINT "EventDetails_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_packageScheduleId_fkey" FOREIGN KEY ("packageScheduleId") REFERENCES "PackageSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "PackageSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WorkCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageTags" ADD CONSTRAINT "_PackageTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageTags" ADD CONSTRAINT "_PackageTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkItemTags" ADD CONSTRAINT "_WorkItemTags_A_fkey" FOREIGN KEY ("A") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkItemTags" ADD CONSTRAINT "_WorkItemTags_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
