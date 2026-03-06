"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm() {
  const route = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      console.log("res login form: ", res);
      if (res?.ok) {
        toast.success("Login success!", {
          duration: 3000,
          position: "top-center",
        });
        route.push("/dashboard");
      } else {
        setError(res?.error ?? "Login failed");
        toast.error("Wrong email or password", {
          duration: 3000,
          icon: "🚨",
          position: "top-center",
        });
      }
    } catch (error) {
      setError(`${JSON.stringify(error)}`);
      toast.error("Login failed. Error:" + error, {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" action={handleSubmit}>
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
        {loading ? <Spinner /> : "Sign In"}
      </Button>
    </form>
  );
}
