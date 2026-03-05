import { getProductOverview } from "@/lib/data";
import useSWR from "swr";
export function useProductDataOverview() {
  const { data, isLoading, error } = useSWR(
    "/products/overview",
    () => getProductOverview(),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    isLoading,
    error,
  };
}
