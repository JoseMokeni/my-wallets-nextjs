import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Github,
    Google,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // If user not found, return null (NextAuth will handle this)
        if (!user) {
          console.log("User not found");
          return null;
        }

        // Check if user has a password (might be null for OAuth users)
        if (!user.password) {
          console.log("User has no password set");
          return null;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        console.log(`User found: ${user.createdAt}`);

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth;
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      // If logged in and on auth page, redirect to home
      if (isLoggedIn && isOnAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Allow access to auth pages when not logged in
      if (isOnAuthPage) {
        return true;
      }

      // Require authentication for all other pages
      return isLoggedIn;
    },
    async signIn({ user, account, profile }) {
      // If using credentials provider and user is null, redirect to register
      if (account?.provider === "credentials" && !user) {
        return false;
      }

      // For OAuth providers, check if there's already an account with this email
      // but from a different provider
      if (
        account?.provider &&
        account.provider !== "credentials" &&
        profile?.email
      ) {
        try {
          // Check if there's already a user with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: {
              accounts: true,
            },
          });

          if (existingUser) {
            // Check if the existing user has accounts from different providers
            const hasOtherProviders = existingUser.accounts.some(
              (existingAccount) => existingAccount.provider !== account.provider
            );

            if (hasOtherProviders) {
              // Prevent sign-in and show error
              console.log(
                `Account linking prevented for ${profile.email}. User already has accounts with different providers.`
              );
              return false;
            }
          }
        } catch (error) {
          console.error("Error checking existing accounts:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Persist user id and other info to JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  // debug: process.env.NODE_ENV === "development",
});
