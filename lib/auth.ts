import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizeRole } from "@/lib/roles";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: normalizeRole(user.role),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = normalizeRole(user.role);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = normalizeRole(
          typeof token.role === "string" ? token.role : "USER",
        );
      }

      return session;
    },
  },
};
