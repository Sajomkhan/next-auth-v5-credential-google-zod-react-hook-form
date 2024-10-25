import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import Github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword } from "./utils/helper";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    google({
      clientId: process.env.GOOGLE_Client_ID,
      clientSecret: process.env.GOOGLE_Client_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_Client_ID,
      clientSecret: process.env.GITHUB_Client_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const hash = saltAndHashPassword(credentials.password);

        let user: any = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              email,
              hashPassword: hash,
            },
          });
        } else {
          if (!user.hashPassword) {
            throw new Error("User does not have a password set.");
          }

          const isMatch = bcrypt.compareSync(
            credentials.password as string,
            user.hashPassword
          );
          if (!isMatch) {
            throw new Error("Incorrect password.");
          }
        }
        return user;
      },
    }),
  ],
});
