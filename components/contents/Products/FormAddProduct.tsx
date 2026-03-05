"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCreate } from "@/data/product";
import { useCategories } from "@/hooks/useCategories";
import { createOne } from "@/lib/actions/product_actions";
import { uploadFileToServer } from "@/lib/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import Image from "next/image";
import z from "zod";
import { Button } from "@/components/ui/button";

export default function FormAddProduct() {
  const { categories, isLoading } = useCategories();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    "https://cdn.dribbble.com/userupload/46006494/file/2cd0434a1ba82e4214f01753182f4527.png?resize=1024x768&vertical=center",
  );
  const formSchema = z.object({
    name: z
      .string()
      .min(5, "Name must be at least 5 characters.")
      .max(150, "Name must be at most 150 characters."),
    thumbnail: z.string().optional(),
    category: z
      .object({
        id: z.string(),
        title: z.string(),
      })
      .refine((value) => value !== null, {
        message: "Please select a category.",
      }).required(),
    price: z.string().refine((value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num > 0;
    }, "Please enter a valid number and greater than 0."),
    stock: z.string().refine((value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }, "Please enter a valid number."),
    active: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      thumbnail: "",
      category: { id: "", title: "" },
      price: "0",
      stock: "0",
      active: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Transform form data to match ProductCreate interface
    const createData: ProductCreate = {
      name: data.name,
      categoryId: data.category.id,
      thumbnail: data.thumbnail,
      price: Number(data.price),
      stock: Number(data.stock),
      active: data.active,
    };

    try {
      const result = await createOne(createData);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Product created successfully");
      // revalidate data
      await mutate(
        (key) => {
          if (typeof key === "string" && key === "/products") return true;
          if (Array.isArray(key) && key[0] === "/products") return true;
          return false;
        },
        undefined,
        { revalidate: true },
      );
      form.reset();
      setThumbnailPreview(
        "https://cdn.dribbble.com/userupload/46006494/file/2cd0434a1ba82e4214f01753182f4527.png?resize=1024x768&vertical=center",
      );
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
      );
    }
  };
  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field className="my-2">
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Product Name"
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

          <div className="md:grid grid-cols-2 gap-4">
            <div className="mr-4">
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => {
                  //console.log("categories", categories);
                  return (
                    <Field>
                      <FieldLabel htmlFor="category">Category</FieldLabel>

                      <Select
                        value={field.value.id || ""}
                        onValueChange={(categoryId) => {
                          const selected = categories.find(
                            (cat) => cat.id === categoryId,
                          );
                          if (selected) {
                            field.onChange(selected);
                          }
                        }}
                      >
                        <SelectTrigger disabled={isLoading}>
                          <SelectValue
                            placeholder={
                              isLoading
                                ? "Loading categories..."
                                : "Select a category"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              ></Controller>
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="price">Price</FieldLabel>
                      <Input
                        id="price"
                        type="number"
                        step="100"
                        min="100"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-invalid={fieldState.invalid}
                        placeholder="Price"
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
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="stock">Value in Stock</FieldLabel>
                      <Input
                        id="stock"
                        type="number"
                        step="1"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-invalid={fieldState.invalid}
                        placeholder="Value in Stock"
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
                name="active"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field className="w-8 md:mt-4">
                      <FieldLabel htmlFor="active">Active</FieldLabel>
                      <Checkbox
                        id="active"
                        className="w-full h-9"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              ></Controller>
            </div>
            <Controller
              name="thumbnail"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      width={80}
                      height={80}
                      loading="eager"
                      className="rounded-md"
                    />
                    <Input
                      id="thumbnail"
                      type="file"
                      name="thumbnail"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file type
                          if (!file.type.startsWith("image/")) {
                            toast.error("Please select an image file");
                            return;
                          }
                          // Validate file size (max 10MB)
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error("File size must be less than 10MB");
                            return;
                          }

                          // Create preview immediately
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result as string;
                            setThumbnailPreview(result);
                          };
                          reader.readAsDataURL(file);

                          // Upload file to server
                          try {
                            const filePath = await uploadFileToServer(file);
                            field.onChange(filePath);
                          } catch (error) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Failed to upload file",
                            );
                            // Revert preview on upload error
                            setThumbnailPreview(
                              field.value ||
                                "https://cdn.dribbble.com/userupload/46006494/file/2cd0434a1ba82e4214f01753182f4527.png?resize=1024x768&vertical=center",
                            );
                          }
                        }
                      }}
                      accept="image/*"
                      aria-invalid={fieldState.invalid}
                      placeholder="Image URL"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            ></Controller>
          </div>

          <Field className="">
            <Button variant="secondary" type="submit" className="">
              Create
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
