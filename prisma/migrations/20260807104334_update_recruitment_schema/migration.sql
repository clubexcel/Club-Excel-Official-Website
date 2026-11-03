/*
  Warnings:

  - You are about to drop the column `email` on the `RecruitmentResponse` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `RecruitmentResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recruitmentId,personalEmail]` on the table `RecruitmentResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hackerrankId` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locality` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nistEmail` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalEmail` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNo` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollNumber` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `techStack` to the `RecruitmentResponse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Locality" AS ENUM ('LOCALITE', 'HOSTELITE');

-- DropIndex
DROP INDEX "RecruitmentResponse_recruitmentId_email_key";

-- AlterTable
ALTER TABLE "RecruitmentResponse" DROP COLUMN "email",
DROP COLUMN "phone",
ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "hackerrankId" TEXT NOT NULL,
ADD COLUMN     "locality" "Locality" NOT NULL,
ADD COLUMN     "nistEmail" TEXT NOT NULL,
ADD COLUMN     "personalEmail" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "registrationNo" TEXT NOT NULL,
ADD COLUMN     "rollNumber" TEXT NOT NULL,
ADD COLUMN     "techStack" TEXT NOT NULL,
ALTER COLUMN "answers" SET DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "RecruitmentResponse_recruitmentId_personalEmail_key" ON "RecruitmentResponse"("recruitmentId", "personalEmail");
