import { hashPassword } from "@/lib/hash_password";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;
  // console.log("log --- route:",body)
  // handleValidetion(name,email,password);
  //check user email exist or not
  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exist) {
    return new Response("User email already exist", { status: 400 });
  }
  // encrypt password
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  //console.log("user", user);
  return Response.json(user);
}
