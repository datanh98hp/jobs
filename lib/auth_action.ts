import { executeAction } from "@/lib/executeAction";
import { toast } from "sonner";
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
const signUpAction = async (input: RegisterInput) => {
  return executeAction({
    actionFn: async () => {
      // const name = formData.get("name");
      // const email = formData.get("email");
      // const password = formData.get("password");
      const { name, email, password } = input;
      if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("Invalid form data");
      }
      //console.log("Form data received from action:", { name, email, password });
      ///  call api registers
      const reg = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!reg.ok) {
        if (reg.status === 400) {
          //throw new Error("User already exists");
          toast.error("User email already exists", {
            duration: 3000,
            position: "top-center",
            style: { color: "red" },
          });
        }
        throw new Error("Failed to register user");
      }
    },
    successMessage: "Signed up successfully",
  });
};

export { signUpAction };
