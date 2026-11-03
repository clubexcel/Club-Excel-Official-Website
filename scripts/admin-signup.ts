import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const signUpAdmin = async () => {
  try {
    const name = "<enter-admin-name>";
    const email = "<enter-admin-email>";
    const password = "<enter-admin-password>";

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        email: true,
      },
    });

    console.log(`Admin: ${admin.email} signed up successfully!`);
  } catch (error) {
    console.error("Failed to sign up Admin", error);
  } finally {
    await prisma.$disconnect();
    console.log("Prisma Connection closed Successfully");
  }
};

signUpAdmin();
