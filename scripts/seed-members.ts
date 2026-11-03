import dotenv from "dotenv";
import { PrismaClient, MediaUsageType, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { uploadLocalImageToCloudinary } from "@/lib/upload-local-cloudinary";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const members = [
  {
    name: "enter-your-name",
    email: "your-email@gmail.com",
    phone: "9112345715",
    imageUrl: "/members/avatar.jpg",
    skills: ["skill"],
    year: "1",
  },
];

const seedMembers = async () => {
  try {
    for (const member of members) {
      const { imageUrl: localImagePath, ...memberData } = member;

      const { url: imageUrl, publicId } = await uploadLocalImageToCloudinary(
        localImagePath.replace("/members/", "members/"),
        "club-members"
      );

      await prisma.$transaction(async (tx) => {
        const created = await tx.member.create({
          data: memberData,
        });

        await tx.media.create({
          data: {
            url: imageUrl,
            publicId,
            usages: {
              create: {
                type: MediaUsageType.PROFILE,
                entityId: created.id,
              },
            },
          },
        });
      });

      console.log(`✔ Added ${member.name}`);
    }

    console.log(`All ${members.length} members added successfully.`);
  } catch (error) {
    console.error("Failed to add members:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedMembers();
