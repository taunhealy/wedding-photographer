-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('HOURLY', 'MULTIDAY');

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "scheduleType" "ScheduleType" NOT NULL DEFAULT 'HOURLY';
