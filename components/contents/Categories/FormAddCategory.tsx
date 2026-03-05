"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CategoryCreate } from "@/data/category";
import { Category } from "@/generated/prisma/client";
import { createOne } from "@/lib/actions/category_actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";
export function FormAddCategory({
  ...props
}: { user_data?: Category } & React.ComponentProps<"div">) {
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
      title: "",
    },
  });
  const onSubmit = async (
    data: z.infer<typeof formSchema | CategoryCreate>,
  ) => {
    const res = await createOne(data as CategoryCreate);
    if (res.error) {
      toast.error("Error: " + res.error);
      return;
    }
    toast.success("Category has been created !");
    // sync data
    // revalidate data
    await mutate(
      (key) => {
        if (typeof key === "string" && key === "/categories") return true;
        if (Array.isArray(key) && key[0] === "/categories") return true;
        return false;
      },
      undefined,
      { revalidate: true },
    );
    form.reset();
  };
  return (
    <div {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    type="text"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Input title here"
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
                Create
              </Button>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </div>
  );
}
