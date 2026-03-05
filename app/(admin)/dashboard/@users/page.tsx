import ChartBarTopEmployee from "@/components/contents/TopEmployeeChart";
import { ChartConfig } from "@/components/ui/chart";
import { getListEmployee } from "@/lib/data";

export default async function Page() {
  const data = await ((await getListEmployee({
    page: 1,
    pageSize: 5,
    search: "",
    sortBy: "salary",
    sortDirection: "desc",
  })) as Promise<{ list: []; total: number; totalPage: number }>);
  /// chart
  const chartData =
    data?.list.map((item: { name: string; salary: number }) => {
      return {
        label: item.name,
        salary: item.salary,
      };
    }) || [];
  /// config for chart
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  return (
    <div className="bg-muted/50 rounded-xl md:min-h-min">
      {/* <div>iad</div> */}
      <ChartBarTopEmployee data={chartData as []} config={chartConfig} />
    </div>
  );
}
