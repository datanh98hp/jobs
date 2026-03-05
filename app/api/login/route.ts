import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // login api login
  const body = await request.json();
  const { email, password } = body;
  
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return Response.json({ error: "User not found" });
  }
  const hashedPassword = user.password;
  if (!hashedPassword) {
    return Response.json({ error: "Password not found" });
  }
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordValid) {
    return Response.json({ error: "Wrong password" });
  }
  return Response.json(user);
}
