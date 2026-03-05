import { authOptions } from "@/lib/authOption";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut } = NextAuth(authOptions);