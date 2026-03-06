/* eslint-disable react-hooks/rules-of-hooks */
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
import { EyeIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { DataTableColumnHeader } from "./data-table-column-header";

import { Category } from "@/generated/prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductUpdate } from "@/data/product";
import { useCategories } from "@/hooks/useCategories";
import { updateById } from "@/lib/actions/product_actions";
import { uploadFileToServer } from "@/lib/upload";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { PutBlobResult } from "@vercel/blob";

export interface ProductData {
  id: string;
  name: string;
  category: Category;
  thumbnail: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const columns: ColumnDef<ProductData>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="max-w-64">
        <p className="truncate">{row.getValue("name")}</p>
      </div>
    ),
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Image
            src={
              product?.thumbnail ||
              "https://cdn.dribbble.com/userupload/46006494/file/2cd0434a1ba82e4214f01753182f4527.png?resize=1024x768&vertical=center"
            }
            alt={product.name}
            width={80}
            height={80}
            loading="lazy"
            style={{ height: "50%", width: "50%" }}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.trim() === "") return true;
      // Compare the category ID with the filter value
      return (row.getValue("category") as Category)?.id === filterValue;
    },
    cell: ({ row }) => {
      const category = row.original.category?.title;

      return <Badge variant="outline">{category || "No Category"}</Badge>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const product = row.original;
      return product.active ? (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          Activating
        </Badge>
      ) : (
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          Not Activate
        </Badge>
      );
    },
  },
  {
    accessorKey: "",
    header: "-",
    cell: ({ row }) => {
      const product = row.original;

      const [thumbnailPreview, setThumbnailPreview] = useState<string>(
        product?.thumbnail ||
          "/thumnail.png",
      );
      const [open, setOpen] = useState(false);
      const [blob, setBlob] = useState<PutBlobResult | null>(null);
      const formSchema = z.object({
        name: z
          .string()
          .min(5, "Name must be at least 5 characters.")
          .max(150, "Name must be at most 100 characters."),
        thumbnail: z.string().optional(),
        category: z
          .object({
            id: z.string(),
            title: z.string(),
          })
          .refine((value) => value !== null, {
            message: "Please select a category.",
          })
          .required(),
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
          name: product.name || "",
          thumbnail: product.thumbnail || "",
          category: product.category || { id: "", title: "" },
          price: JSON.stringify(product.price) || "0",
          stock: JSON.stringify(product.stock) || "0",
          active: product.active || false,
        },
      });
      const onSubmit = async (data: z.infer<typeof formSchema>) => {
        //  console.log("data update submit", data);

        // Transform form data to match ProductUpdate interface
        const updateData: ProductUpdate = {
          name: data.name,
          categoryId: data.category.id,
          thumbnail: data.thumbnail,
          price: Number(data.price),
          stock: Number(data.stock),
          active: data.active,
        };
        ///console.log("Transformed data:", updateData);
        try {
          const result = await updateById(product.id, updateData);
          // console.log("Update result:", result);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success("Product updated successfully");
          // Reload products data - use filter to match all product-related keys
          // This handles both simple "/products" key and complex keys like ["/products", page, pageSize]
          await mutate(
            (key) => {
              if (typeof key === "string" && key === "/products") return true;
              if (Array.isArray(key) && key[0] === "/products") return true;
              return false;
            },
            undefined,
            { revalidate: true },
          );
          ///
          setOpen(false);
        } catch (error) {
          console.error("Submit error:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to update product",
          );
        }
      };
      // update data when open dialog and product value change
      useEffect(() => {
        if (open) {
          form.reset({
            name: product.name,
            thumbnail: product.thumbnail,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            active: product.active,
          });
          setThumbnailPreview(
            product?.thumbnail ||
              "https://cdn.dribbble.com/userupload/46006494/file/2cd0434a1ba82e4214f01753182f4527.png?resize=1024x768&vertical=center",
          );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [open, product]);

      return (
        <div>
          <Dialog key={product.id} modal open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EyeIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Update Product </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
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
                          const { categories, isLoading } = useCategories();
                          //console.log("categories", categories);
                          return (
                            <Field>
                              <FieldLabel htmlFor="category">
                                Category
                              </FieldLabel>

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
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
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
                                step="0.01"
                                min="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
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
                              <FieldLabel htmlFor="stock">
                                Value in Stock
                              </FieldLabel>
                              <Input
                                id="stock"
                                type="number"
                                step="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
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
                            <Field className="md:w-1/8 w-8 md:mt-4  ">
                              <FieldLabel htmlFor="active">Active</FieldLabel>
                              <Checkbox
                                id="active"
                                className="w-2 h-9 border"
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
                            <FieldLabel htmlFor="thumbnail">
                              Thumbnail
                            </FieldLabel>
                            <Image
                              src={thumbnailPreview}
                              alt={product.name}
                              height={220}
                              width={220}
                              style={{ height: "70%", width: "100%" }}
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
                                    toast.error(
                                      "File size must be less than 10MB",
                                    );
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
                                    // const filePath =
                                    //   await uploadFileToServer(file);
                                    //handle delete file exist on server
                                    if (product?.thumbnail) {
                                      const resDel = await fetch(
                                        `/api/blob/delete?url=${product?.thumbnail}`,
                                        {
                                          method: "DELETE",
                                        },
                                      );
                                      if (!resDel.ok) {
                                        toast.error("Failed to update file");
                                        return;
                                      }
                                    }

                                    // handle file upload
                                    const response = await fetch(
                                      `/api/blob/upload?filename=${file.name}`,
                                      {
                                        method: "POST",
                                        body: file,
                                      },
                                    );
                                    const newBlob =
                                      (await response.json()) as PutBlobResult;

                                    setBlob(newBlob);
                                    const filePath = newBlob.url;
                                    field.onChange(filePath);
                                  } catch (error) {
                                    toast.error(
                                      error instanceof Error
                                        ? error.message
                                        : "Failed to upload file",
                                    );


                                    // Revert preview on upload error
                                    setThumbnailPreview(
                                      product?.thumbnail ||
                                        "/thumnail.png",
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
                      Save changes
                    </Button>
                  </Field>
                </FieldGroup>
              </form>

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
