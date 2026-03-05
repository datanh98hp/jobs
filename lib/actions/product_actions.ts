"use server";

import { revalidatePath } from "next/cache";
import Api from "../api";
import { ProductCreate, ProductUpdate } from "@/data/product";
const product_api = new Api<ProductCreate | ProductUpdate | null>();
export async function createOne(product: ProductCreate) {
  try {
    const res = await product_api.createNew(product, "products");

    revalidatePath("/");
    revalidatePath("/manages/products", "page");

    return res.json();
  } catch (error) {
    return {
      error,
    };
  }
}

export async function updateById(id: string, data: ProductUpdate) {
  try {
    const res = await product_api.updateById(id, data, "products");
    const json = await res.json();

    // console.log("updateById response:", json);

    if (!res.ok) {
      return {
        error: json.error || "Failed to update product",
      };
    }

    revalidatePath("/");
    revalidatePath("/manages/products", "page");

    return json;
  } catch (error) {
    console.error("updateById error:", error);
    return {
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}

export async function deleteListProduct(ids: string[]) {
  try {
    //console.log("ids", ids);
    const res = await product_api.delete(ids, `products`);
    revalidatePath("/");
    revalidatePath("/manages/products");
    return res.json();
  } catch (error) {
    return error;
  }
}
export async function seeds() {
  const res = await product_api.seeds();
  // console.log("--log seeds", res);
  revalidatePath("/");
  revalidatePath("/manages/products");
  return res.json();
}
