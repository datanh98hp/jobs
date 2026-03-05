import { ProductOverviewDataRequest } from "@/data/product";
import { getProductDataChart } from "@/lib/data";
import useSWR from "swr";
export function useChartDataOverview(filter: ProductOverviewDataRequest) {
  const { data, isLoading, error } = useSWR(
    ["/products/chart", filter],
    () => getProductDataChart(filter),
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
