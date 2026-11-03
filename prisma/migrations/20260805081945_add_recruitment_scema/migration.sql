/*
  Warnings:

  - The values [RECRUITMENT] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Recruitment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecruitmentDriveStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('TECH', 'NON_TECH');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
COMMIT;

-- DropTable
DROP TABLE "Recruitment";

-- CreateTable
CREATE TABLE "RecruitmentDrive" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER NOT NULL,
    "status" "RecruitmentDriveStatus" NOT NULL DEFAULT 'UPCOMING',
    "registrationStart" TIMESTAMP(3),
    "registrationEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "RecruitmentDrive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruitmentFormField" (
    "id" TEXT NOT NULL,
    "recruitmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecruitmentFormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruitmentResponse" (
    "id" TEXT NOT NULL,
    "recruitmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruitmentResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruitmentResponse_recruitmentId_email_key" ON "RecruitmentResponse"("recruitmentId", "email");

-- AddForeignKey
ALTER TABLE "RecruitmentDrive" ADD CONSTRAINT "RecruitmentDrive_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitmentFormField" ADD CONSTRAINT "RecruitmentFormField_recruitmentId_fkey" FOREIGN KEY ("recruitmentId") REFERENCES "RecruitmentDrive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitmentResponse" ADD CONSTRAINT "RecruitmentResponse_recruitmentId_fkey" FOREIGN KEY ("recruitmentId") REFERENCES "RecruitmentDrive"("id") ON DELETE CASCADE ON UPDATE CASCADE;
