-- CreateTable
CREATE TABLE "Recruitment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rollNo" TEXT NOT NULL,
    "instituteEmail" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recruitment_pkey" PRIMARY KEY ("id")
);
