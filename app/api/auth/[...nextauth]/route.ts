import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      // Add your authentication logic here
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      // Example: Check credentials against your database
      // const user = await getUserByEmail(credentials.email);
      // if (user && await verifyPassword(credentials.password, user.password)) {
      //   return { id: user.id, email: user.email };
      // }

      return null; // Return null if authentication fails
    }
  })
],
});

export { handler as GET, handler as POST };
