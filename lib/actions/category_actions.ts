"use server";
import { CategoryCreate, CategoryUpdate } from "@/data/category";
import Api from "@/lib/api";
import { revalidatePath } from "next/cache";
const categoryApi = new Api<CategoryCreate>();
export async function createOne(category: CategoryCreate) {
  //   try {
  const res = await categoryApi.createNew(category, "categories");
  revalidatePath("/");
  revalidatePath("/manages/categories");
  return res.json();
  //   } catch (error) {
  //     return {
  //       error,
  //     };
  //   }
}

export async function updateById(id: string, data: CategoryUpdate) {
  // try {

  const res = await categoryApi.updateById(id, data, "categories");

  revalidatePath("/");
  revalidatePath("/manages/categories");
  return res.json();
  // } catch (error) {
  //   return {
  //     error,
  //   }
  // }
}

export async function deleteListCategory(ids: string[]) {
  try {
    const res = await categoryApi.delete(ids, `categories`);
    revalidatePath("/");
    revalidatePath("/manages/categories");
    return res.json();
  } catch (error) {
    return error;
  }
}
