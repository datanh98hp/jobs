"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Employee } from "@/generated/prisma/client";
import { RegisterInput, signUpAction } from "@/lib/auth_action";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


export function RegisterForm({
  ...props
}: { user_data?: Employee } & React.ComponentProps<typeof Card>) {
  const formSchema = z.object({
    email: z.email({
      error: "Please enter a valid email address.",
    }),
    name: z
      .string()
      .min(5, "Name must be at least 5 characters.")
      .max(20, "Name must be at most 20 characters."),
    password: z
      .string()
      .min(5, "password must be at least 5 characters.")
      .max(20, "password must be at most 20 characters."),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema | RegisterInput>) => {
  
    const res = await signUpAction(data as RegisterInput);
    if (res.success) {
      toast.success("Signed up successfully");
      redirect("/auth/login");
    } else {
      console.log("Error", res);
    }
    form.reset();
  };
  return (
    <Card {...props}>
      {/* <CardHeader>
        <CardTitle>Create an employee</CardTitle>
        <CardDescription>
          Enter your information below to create an employee
        </CardDescription>
      </CardHeader> */}
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Input your name"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            ></Controller>

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="email@gmail.com"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            ></Controller>

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            ></Controller>

            <FieldGroup>
              <Field>
                <Button variant="default" type="submit">
                  Sign Up
                </Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
