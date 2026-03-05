import useSWR from "swr";
import { getCategories } from "@/lib/data";
import { Category } from "@/generated/prisma/client";

/**
 * Custom hook to fetch categories
 * @returns Object with categories list and loading state
 */
export function useCategories() {
  const { data, isLoading, error } = useSWR(
    "/categories",
    () =>
      getCategories({
        page: 1,
        pageSize: 100,
        search: "",
        sortBy: "title",
        sortDirection: "asc",
      }),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    categories: (data?.list as Category[]) || [],
    isLoading,
    error,
  };
}
