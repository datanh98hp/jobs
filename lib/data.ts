import { FilterCategory } from "@/data/category";
import { FilterEmployee } from "@/data/employee";
import { FilterProduct, ProductOverviewDataRequest } from "@/data/product";
import Api from "./api";

const api = new Api();
export async function getListEmployee(filter: FilterEmployee) {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;
  const response = await api.getList(
    `employee?sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&sortDirection=${sortDirection}&search=${search}`,
  );
  // if (!response.ok) {
  //   const text = await response.text();
  //   // throw new Error(
  //   //   `API error: ${response.status} ${response.statusText} - ${text}`,
  //   // );
  //   return {
  //     error: `API error: ${response.status} ${response.statusText} - ${text}`,
  //   };
  // }

  return response.json();
}

export async function getProducts(filter: FilterProduct) {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;

  const response = await api.getList(
    `products?sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&sortDirection=${sortDirection}&search=${search}`,
    // );
  );

 

  return response.json();
}

export async function getCategories(filter: FilterCategory) {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;

  const response = await api.getList(
    `categories?sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&sortDirection=${sortDirection}&search=${search}`,
    // );
  );

  

  return response.json();
}

export async function getProductOverview() {
  const response = await api.overview();
  
  return response.json();
}

export async function getProductDataChart(filter: ProductOverviewDataRequest) {
  const response = await api.chartData(filter);
  
  return response.json();
}
