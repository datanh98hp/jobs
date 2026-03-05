import { LoginForm } from "@/components/contents/LoginForm";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession();
  if (session) return redirect("/dashboard");
  // const handleSignIn = async (formData: FormData) => {
  //   "use server";
  //   console.log("Form data received from page:", formData);
  //   await signIn("credentials", formData);
  // };
  return (
    <div className="w-full h-screen max-w-sm mx-auto flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      {/* <SignInGitHub /> */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        {/* <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div> */}
      </div>

      {/* Email/Password Sign In */}
      {/* <form
        className="space-y-4"
        action={async (formData) => {
          "use server";
          console.log("Form data received from page:", formData);
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            callbackUrl: "/",
          });
        }}
      >
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
          autoComplete="current-password"
        />
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form> */}
      <LoginForm />
      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/auth/register">Don&apos;t have an account? Sign up</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
