import { NextAuthOptions, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { type: "text" } // Will be 'buyer' or 'seller' or 'admin'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Please provide all required fields");
        }

        try {
          const user = await UserModel.validateUser(
            credentials.email,
            credentials.password,
            credentials.role as 'buyer' | 'seller' | 'admin'
          );

          if (!user) {
            throw new Error("Invalid credentials or insufficient permissions");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            roles: user.roles,
            country: user.country
          };
        } catch (error) {
          console.error('Authentication error:', error);
          if (error instanceof Error && error.message === 'Account suspended') {
            throw new Error('Account suspended');
          }
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
        token.id = user.id;
        token.country = user.country;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.roles = token.roles as string[];
        session.user.id = token.id as string;
        session.user.country = token.country as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  }
};

declare module "next-auth" {
  interface User {
    roles?: string[];
    id?: string;
    country?: string;
  }

  interface Session extends DefaultSession {
    user: {
      roles?: string[];
      id?: string;
      country?: string;
    } & DefaultSession['user']
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
    id?: string;
    country?: string;
  }
}