-- CreateEnum
CREATE TYPE "EventStatusType" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "status" "EventStatusType" NOT NULL DEFAULT 'UPCOMING';
