import { RegisterForm } from "@/components/contents/RegisterForm";
import { Button } from "@/components/ui/button";

import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession();
  if (session) redirect("/");

  return (
    <div className="w-full max-w-sm mx-auto h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up Account</h1>

      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div> */}

      {/* Email/Password Sign Up */}
      {/* <form
        className="space-y-4"
        action={async (formData) => {
          "use server";
          const res = await signUpAction(formData);
          if (res.success) {
            redirect("/auth/login");
          }else {
            console.log("Error", res);
          }
        }}
      >
        <Input
          name="name"
          placeholder="Your name"
          type="text"
          required
          autoComplete="name"
        />
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="new-password"
        />
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form> */}
      <div className="w-full">
        <RegisterForm />
      </div>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/auth/login">Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
