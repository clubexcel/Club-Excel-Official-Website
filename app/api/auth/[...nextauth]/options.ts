import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await prisma.$connect();

          const user = await prisma.admin.findUnique({
            where: { email: credentials?.email },
            select: {
              id: true,
              email: true,
              password: true,
            },
          });

          if (!user) {
            throw new Error("Invalid Credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials?.password,
            user.password
          );

          if (isPasswordValid) {
            return user;
          } else {
            throw new Error("Invalid Credentials");
          }
        } catch (err: any) {
          throw new Error(err?.message || "Something went wrong");
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.email = user.email;
      }
      return token;
    },
  },
};
