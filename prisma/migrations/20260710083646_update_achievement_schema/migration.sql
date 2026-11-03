/*
  Warnings:

  - Added the required column `achievedAt` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('HACKATHON', 'COMPETITION', 'CERTIFICATION', 'WORKSHOP', 'INTERNSHIP', 'PLACEMENT', 'RESEARCH', 'PUBLICATION', 'OPEN_SOURCE', 'OTHER');

-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "achievedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "tag" "AchievementType" NOT NULL;
