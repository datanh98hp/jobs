"use server";
import { EmployeeCreate, EmployeeUpdate } from "@/data/employee";
import { revalidatePath } from "next/cache";
import Api from "@/lib/api";
const employeeApi = new Api<EmployeeCreate | EmployeeUpdate | null>();

export async function createOne(employee: EmployeeCreate) {
  const employeeApi = new Api<EmployeeCreate>();
  try {
    const res = await employeeApi.createNew(employee, "employee");

    revalidatePath("/");
    revalidatePath("/manages/employee");
    return res.json();
  } catch (error) {
    return {
      error,
    };
  }
}

export async function updateById(id: string, data: EmployeeUpdate) {
  // try {
    const res = await employeeApi.updateById(id, data, "employee");

    revalidatePath("/");
    revalidatePath("/manages/employee");
    return res.json();
  // } catch (error) {
  //   return {
  //     error,
  //   }
  // }
}

export async function deleteListEmployee(ids: string[]) {
  try {
    const res = await employeeApi.delete(ids, `employee`);

    revalidatePath("/");
    revalidatePath("/manages/users");
    return res.json();
  } catch (error) {
    return error;
  }
}
export async function seeds() {
  const res = await employeeApi.seeds();
  // console.log("--log seeds", res);
  revalidatePath("/");
  revalidatePath("/manages/users");
  return res.json();
}
