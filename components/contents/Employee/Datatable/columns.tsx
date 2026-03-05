/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, EyeIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { DataTableColumnHeader } from "./data-table-column-header";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Employee } from "@/generated/prisma/client";
import { EmployeeUpdate } from "@/data/employee";
import { updateById } from "@/lib/actions/employee_actions";
import { handleMutation } from "@/lib/mutation-handler";

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "jobTitle",
    header: "Job",
  },
  {
    accessorKey: "",
    header: " ",
    cell: ({ row }) => {
      const user_data = row.original;
      const router = useRouter();
      const formSchema = z.object({
        email: z.email({
          error: "Please enter a valid email address.",
        }),
        firstName: z
          .string()
          .min(5, "Description must be at least 5 characters.")
          .max(20, "Description must be at most 20 characters."),
        lastName: z
          .string()
          .min(5, "Description must be at least 5 characters.")
          .max(20, "Description must be at most 20 characters."),
        phone: z.string().min(10, "Must be at least 10 characters long."),
        address: z
          .string()
          .min(5, "Description must be at least 5 characters."),
        jobTitle: z
          .string()
          .min(5, "Description must be at least 5 characters.")
          .max(100, "Description must be at most 100 characters."),
        avatar: z
          .string()
          .min(5, "Description must be at least 5 characters.")
          .max(500, "Description must be at most 20 characters.")
          .optional(),
      });
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
          email: user_data?.email || "",
          firstName: user_data?.firstName || "",
          lastName: user_data?.lastName || "",
          phone: user_data?.phone || "",
          address: user_data?.address || "",
          avatar: user_data?.avatar || "",
          jobTitle: user_data?.jobTitle || "",
        },
      });
      const onSubmit = async (
        data: z.infer<typeof formSchema | EmployeeUpdate>,
      ) => {
        try {
          await handleMutation(
            () => updateById(user_data.id, data as EmployeeUpdate),
            {
              successMessage: "Employee updated successfully",
              errorMessage: "Failed to update product",
              reloadKey: "/employee",
            },
          );
        } catch {
          // Error is already handled by handleMutation
        }
      };

      return (
        <div>
          <Dialog key={user_data.id}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EyeIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Update user {user_data.lastName} </DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <Field>
                            <FieldLabel htmlFor="firstName">
                              First Name
                            </FieldLabel>
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
                            <FieldLabel htmlFor="lastName">
                              Last Name
                            </FieldLabel>
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
                            <FieldLabel htmlFor="jobTitle">
                              Job Title
                            </FieldLabel>
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

                    <Field className="border flex flex-row">
                      <DialogClose asChild>
                        <Button variant="secondary" type="submit" className="">
                          Save changes
                        </Button>
                      </DialogClose>
                    </Field>
                  </FieldGroup>
                </form>
              </div>
              <DialogFooter>
                {/* <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose> */}
                {/* <Button type="submit">Save changes</Button> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
