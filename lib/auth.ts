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
        role: { type: "text" } // Will be 'buyer' or 'seller'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Please provide all required fields");
        }

        try {
          const user = await UserModel.validateUser(
            credentials.email,
            credentials.password,
            credentials.role as 'buyer' | 'seller'
          );

          if (!user) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
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
    role?: string;
    id?: string;
  }

  interface Session extends DefaultSession {
    user: {
      role?: string;
      id?: string;
    } & DefaultSession['user']
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}
