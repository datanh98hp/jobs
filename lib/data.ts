import { FilterCategory } from "@/data/category";
import { FilterEmployee } from "@/data/employee";
import { FilterProduct, ProductOverviewDataRequest } from "@/data/product";
import Api from "./api";

const api = new Api();
export async function getListEmployee(filter: FilterEmployee) {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;

  const data = await api.getList(
    `employee?sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&sortDirection=${sortDirection}&search=${search}`,
    // );
  );

  return data.json();
}

export async function getProducts(filter: FilterProduct) {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;

  const data = await api.getList(
    `products?sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&sortDirection=${sortDirection}&search=${search}`,
    // );
  );

  return data.json();
}

export async function getCategories(filter: FilterCategory) {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;

  const data = await api.getList(
    `categories?sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&sortDirection=${sortDirection}&search=${search}`,
    // );
  );

  return data.json();
}

export async function getProductOverview() {
  const data = await api.overview();
  return data.json();
}

export async function getProductDataChart(filter: ProductOverviewDataRequest) {
  const data = await api.chartData(filter);
  return data.json();
}
