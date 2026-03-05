"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EmployeeCreate } from "@/data/employee";
import { Employee } from "@/generated/prisma/client";
import { createOne } from "@/lib/actions/employee_actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";
export function FormUser({
  ...props
}: { user_data?: Employee } & React.ComponentProps<typeof Card>) {
  const checkSalary = (value: string, limitValue: number) => {
    const parsedValue = Number(value);
    return parsedValue >= limitValue ? true : false;
  };
  const formSchema = z.object({
    email: z.email({
      error: "Please enter a valid email address.",
    }),
    firstName: z
      .string()
      .min(5, "firstName must be at least 5 characters.")
      .max(20, "firstName must be at most 20 characters."),
    lastName: z
      .string()
      .min(5, "lastName must be at least 5 characters.")
      .max(20, "lastName must be at most 20 characters."),
    phone: z.string().min(10, "Must be at least 10 characters long."),
    address: z.string().min(5, "address must be at least 5 characters."),
    jobTitle: z
      .string()
      .min(5, "Description must be at least 5 characters.")
      .max(100, "Description must be at most 100 characters."),
    avatar: z
      .string()
      .min(5, "Description must be at least 5 characters.")
      .max(500, "Description must be at most 20 characters.")
      .optional(),
    salary: z.string().refine((value) => checkSalary(value, 500), {
      message: "Salary must be at least 500",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      avatar: "",
      jobTitle: "",
      salary: "",
    },
  });
  const onSubmit = async (
    data: z.infer<typeof formSchema | EmployeeCreate>
  ) => {
    const res = await createOne(data as EmployeeCreate);
    if (res.error) {
      toast.error("Error: " + res.error);
      return;
    }
    toast.success("Users has been created !");
    //sync data
    mutate("/employee");
    mutate("/employee-chart");
    form.reset();
  };
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an employee</CardTitle>
        <CardDescription>
          Enter your information below to create an employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="John"
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
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Doe"
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
                      type="email"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="2i0yE@example.com"
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
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      id="phone"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="+84 23456789"
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
              name="avatar"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                    <Input
                      id="avatar"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="https://example.com/avatar.jpg"
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
              name="jobTitle"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
                    <Input
                      id="jobTitle"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Software Engineer"
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
              name="salary"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="salary">Salary</FieldLabel>
                    <Input
                      id="salary"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="000000"
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
              name="address"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <Input
                      id="address"
                      type="text"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ha Noi"
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
                  Create now
                </Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
