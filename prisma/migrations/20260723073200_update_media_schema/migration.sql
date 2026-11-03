/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "imageUrl";
