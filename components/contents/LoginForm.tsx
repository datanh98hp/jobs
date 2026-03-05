"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function LoginForm() {
  const route = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        // callbackUrl: "/",
      });
      console.log("res login form: ", res?.ok);
      if (!res?.ok) {
        setError(res?.error ?? "Login failed");
        toast.error("Wrong email or password", {
          duration: 3000,
          icon: "🚨",
          position: "top-center",
        });
      }
      //console.log("success", session);
      //
    } catch (error) {
      // console.log("error catch", error);
      setError(`${JSON.stringify(error)}`);
      toast.error("Login failed. Error:" + error, {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }

    if (status === "loading") {
      setLoading(true);
      //console.log("loading: error", error);
    }

    if (status === "authenticated" || session) {
      toast.error("Login success !", {
        duration: 3000,
        position: "top-center",
      });
      route.push("/dashboard");
      return;
    }

    //route.push("/dashboard");
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
