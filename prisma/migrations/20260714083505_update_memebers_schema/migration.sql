/*
  Warnings:

  - You are about to drop the column `status` on the `Member` table. All the data in the column will be lost.
  - The `role` column on the `Member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "status",
ADD COLUMN     "designation" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
