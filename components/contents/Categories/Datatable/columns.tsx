/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
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
import { Eye, EyeIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { DataTableColumnHeader } from "./data-table-column-header";

import { CategoryUpdate } from "@/data/category";
import { Category } from "@/generated/prisma/client";
import { updateById } from "@/lib/actions/category_actions";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { toast } from "sonner";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: " ",
    header: ({ table }) => (
      <EyeIcon className="h-4 w-4 cursor-pointer self-center" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      const formSchema = z.object({
        title: z
          .string()
          .min(4, "Title must be at least 4 characters.")
          .max(50, "Title must be at most 50 characters.")
          .trim(),
      });
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
          title: item?.title || "",
        },
      });
      const [open, setOpen] = useState(false);
      const onSubmit = async (
        data: z.infer<typeof formSchema | CategoryUpdate>,
      ) => {
        try {
          await updateById(item.id, data as CategoryUpdate);

          // Revalidate all category-related SWR keys
          mutate(
            (key) => {
              // Match both "/categories" and array keys like ["/categories", page, size]
              return (
                (typeof key === "string" && key === "/categories") ||
                (Array.isArray(key) && key[0] === "/categories")
              );
            },
            undefined,
            { revalidate: true },
          );

          toast.success("Category updated successfully");
          setOpen(false);
        } catch (error) {
          console.error("Failed to update category", error);
          toast.error("Failed to update category");
        }
      };
      // update data when open dialog and product value change
      useEffect(() => {
        if (open) {
          form.reset({
            title: item.title,
          });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [open, item]);

      return (
        <div>
          <Dialog key={item.id} modal open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EyeIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Update title category </DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller
                      name="title"
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
                    <Field className="border flex flex-row">
                      <Button variant="secondary" type="submit" className="">
                        Save changes
                      </Button>
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
