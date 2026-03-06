"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import clsx from "clsx";
import useSWR from "swr";
import { getListEmployee } from "@/lib/data";
import swrConfig from "@/lib/swr-config";
import ChartBarTopEmployee from "./TopEmployeeChart";
import { ChartConfig } from "../../ui/chart";

export default function CardInf({
  className,
  ...props
}: React.ComponentProps<typeof Card> & {
  className?: string;
}) {
  const { data } = useSWR(
    "/employee-chart",
    () =>
      getListEmployee({
        page: 1,
        pageSize: 5,
        search: "",
        sortBy: "salary",
        sortDirection: "desc",
      }),
    {
      suspense: true,
      fallbackData: { list: [], total: 0, totalPage: 0, page: 1, pageSize: 10 },
      ...swrConfig,
    }
  );
  
  /// chart
  const chartData = data?.list.map((item: { name: string; salary: number }) => {
    return {
      label: item.name,
      salary: item.salary,
    };
  });
  /// config for chart
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  return (
    <>
      <div className="p-4 md:w-[60%]">
        <div className="md:flex justify-between">
          <Card
            {...props}
            className={clsx(
              className,
              `md:w-68 my-2 hover:cursor-pointer hover:bg-gray-800`
            )}
          >
            <CardHeader>
              <CardTitle>Total Employee</CardTitle>
              <CardDescription>Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{data?.total}</p>
            </CardContent>
            {/* <CardAction>
                <Button>Card Action</Button>
              </CardAction> */}
            {/* <CardFooter>
                <Button>Card Footer</Button>
              </CardFooter> */}
          </Card>
        </div>
      </div>
      <div className="p-4 md:w-[40%] ">
        <ChartBarTopEmployee data={chartData} config={chartConfig} />
      </div>
    </>
  );
}
