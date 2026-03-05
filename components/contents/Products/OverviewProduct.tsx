"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChartDataOverview } from "@/hooks/useChartDataOverview";
import { useProductDataOverview } from "@/hooks/useProductDataOverview";
import { getTimeString } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { mutate } from "swr";
import { fa, tr } from "zod/v4/locales";

export const OverviewProductCard = () => {
  const [catcoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState(true);
  const [alignItemWithTrigger, setAlignItemWithTrigger] = React.useState(true);

  // getData for overiew product
  const prdOverview = useProductDataOverview();
  //console.log("prdOverview", prdOverview);
  //   const { categories, isLoading, error } = useCategories();

  // custome return chartData

  const resChart = useChartDataOverview({
    status: status,
  });
  // getData for chart
  interface ChartData {
    title: string;
    count: number;
  }

  const dataChart = () => {
    try {
      if (!resChart.data) return [];
      const chartData = resChart.data?.map(
        (item: { id: string; name: string; count: number }) =>
          ({
            title: item.name,
            count: item.count,
          }) as ChartData,
      );
      return chartData;
    } catch {
      toast.error("Error: can't get data chart", {
        duration: 2000,
        position: "top-center",
      });
      return [];
    }
  };

  //   const chartData = [
  //     { title: "ẳqw r", count: 186 },
  //     { title: "ăfjjfoj 2", count: 305 },
  //   ];

  const chartConfig = {
    count: {
      label: "SL",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  //console.log("data", prdOverview);

  // handle update chart when change value
  const handleUpdateChart = async (data: { status: boolean }) => {
    setStatus(data.status);
    //setCategoryId(data.cagetoryId);
    await mutate(
      (key) => {
        if (typeof key === "string" && key.startsWith("/products/chart"))
          return true;
        if (Array.isArray(key) && key[0].startsWith("/products/chart"))
          return true;
        return false;
      },
      undefined,
      { revalidate: true },
    );
  };
  return (
    <div className="h-fit">
      <div className="w-full  md:grid grid-cols-4 gap-4 my-4 ">
        <div className="col-span-1 h-20 p-2 my-4 hover:bg-slate-700 hover:text-white rounded-xl">
          <p className="text-sm font-semibold mb-3">Tổng sản phẩm</p>
          <p className="text-2xl font-semibold">
            {prdOverview?.data?.total_products}{" "}
          </p>
        </div>
        <div className=" col-span-1 h-20 p-2 my-4 hover:bg-yellow-700 hover:text-white rounded-xl">
          <p className="text-sm font-semibold mb-3">SL Tồn kho</p>
          <p className="text-2xl font-semibold">
            {prdOverview?.data?.instock_products}
          </p>
        </div>
        <div className=" col-span-1 h-20 p-2 my-4 hover:bg-blue-700 hover:text-white rounded-xl">
          <p className="text-sm font-semibold mb-3">SP hoạt động</p>
          <p className="text-2xl font-semibold">
            {prdOverview?.data?.count_category}
          </p>
        </div>
        {/* <div className=" col-span-1 h-20 p-2 my-4 hover:bg-red-500 hover:text-white rounded-xl">
          <p className="text-sm font-semibold mb-3">SL bán ra hôm nay   </p>
          <p className="text-2xl font-semibold">10</p>
        </div> */}
        <div className=" col-span-1 h-20 p-2 my-4 hover:bg-red-500 hover:text-white rounded-xl">
          <p className="text-sm font-semibold mb-3">SL Danh muc SP </p>
          <p className="text-2xl font-semibold">
            {prdOverview?.data?.count_category}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mx-2">
        <p>{getTimeString()}</p>
        <div className="my-4 flex gap-4 justify-end">
          <Select
            defaultValue="1"
            onValueChange={(value) =>
              handleUpdateChart({
                status: value === "1" ? true : false,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent
              position={alignItemWithTrigger ? "item-aligned" : "popper"}
            >
              <SelectGroup>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">No Active</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <Select
            defaultValue=" "
            onValueChange={(value) =>
              handleUpdateChart({ status, cagetoryId: value })
            }
          >
            <SelectTrigger disabled={isLoading}>
              <SelectValue
                placeholder={
                  isLoading ? "Loading categories..." : "Select a category"
                }
              />
            </SelectTrigger>
            <SelectContent
              position={alignItemWithTrigger ? "item-aligned" : "popper"}
            >
              <SelectGroup>
                <SelectItem value=" ">Select a cateory</SelectItem>
                {categories &&
                  categories?.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={dataChart()}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="title"
                tickLine={false}
                tickMargin={4}
                axisLine={false}
                tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 10)}...` : value}
                angle={-90}
                textAnchor="end"
                height={80}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-chart-1)" radius={10} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          
        </CardFooter>
      </Card>
    </div>
  );
};
