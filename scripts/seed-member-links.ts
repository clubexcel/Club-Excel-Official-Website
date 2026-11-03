import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const links = [
  {
    memberId: "<enter-member-id>",
    platform: "linkedin",
    url: "<enter-your-url>",
  },
];

async function main() {
  try {
    const result = await prisma.memberLink.createMany({
      data: links,
    });

    console.log(`✅ Added ${result.count} LinkedIn links.`);
  } catch (error) {
    console.error("❌ Failed to add LinkedIn links:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
