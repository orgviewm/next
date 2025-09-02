import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

import { upsertProfile } from "@/lib/profile-manager";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return true;

      try {
        await upsertProfile({
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
        });
      } catch (error) {
        console.error("Profile upsert failed:", error);
        // Don't block sign-in if profile creation fails
      }
      return true;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/auth",
  },
});
