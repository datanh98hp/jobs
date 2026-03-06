import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // console.log("credentials check  from credentials: ", credentials);
        if (
          credentials?.email.trim() === "" ||
          credentials?.password.trim() === ""
        ) {
          throw new Error("Email and password are required");
        }
        //console.log("email check  : ", email);
        //console.log("process.env.API_URL", process.env.API_URL);
        //console.log("API_URL", process.env.API_URL);
        const res = await fetch(`${process.env.API_URL}/api/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        //console.log("credentials check res: ", res);

        if (res.ok) {
          const user = await res.json();
          //console.log("credentials check user: ", user);

          return user;
        }
        // console.log("credentials check  user error: ", user);
        // If no user found, return null
        return null;
      },
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    //   id: "github",
    //   name: "GitHub",

    //   authorization: {
    //     url: "https://github.com/login/oauth/authorize",
    //     params: { scope: "read:user user:email" },
    //   },
    //   token: "https://github.com/login/oauth/access_token",
    //   userinfo: {
    //     async request({ client, tokens }) {
    //       {
    //         const profile = await client.userinfo(tokens.access_token!);
    //         const res = await fetch("https://api.github.com/user/emails", {
    //           headers: { Authorization: `token ${tokens.access_token}` },
    //         });
    //         if (res.ok) {
    //           const emails: GithubEmail[] = await res.json();
    //           profile.email = (
    //             emails.find((e) => e.primary) ?? emails[0]
    //           ).email;
    //         }
    //         //console.log("profile : ", profile);
    //         return profile;
    //       }
    //     },
    //   },
    //   profile(profile) {
    //     //console.log("profile : ", profile);
    //     return {
    //       id: profile.id.toString(),
    //       name: profile.name ?? profile.login,
    //       email: profile.email,
    //       image: profile.avatar_url,
    //     };
    //   },
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      // console.log("session auth : ", session);
      return session;
    },
    // redirect({ url, baseUrl }) {
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return `${baseUrl}/dashboard`;
    // },
  },
};
