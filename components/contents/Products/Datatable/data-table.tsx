/* eslint-disable react-hooks/incompatible-library */
"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/generated/prisma/client";
import { useCategories } from "@/hooks/useCategories";
import { deleteListProduct } from "@/lib/actions/product_actions";
import { export_data, TypeFile } from "@/lib/export";
import { handleMutation } from "@/lib/mutation-handler";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { ProductData } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // numOfPage: number;
}
interface DataExportType {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  price: number;
  stock: number;
  active: string;
}
export function DataTable<TData, TValue>({
  columns,
  data,
  // numOfPage,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Reset row selection when data changes ,,,,,
  useEffect(() => {
    setRowSelection({});
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  });
  const [alignItemWithTrigger, setAlignItemWithTrigger] = React.useState(true);
  const { categories, isLoading } = useCategories();
  const handleClickDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const items = selectedRows.map((row) => row.original as Product);
    const ids = items.map((item) => item.id);
    //console.log("ids", ids);
    if (ids.length > 0) {
      try {
        await handleMutation(() => deleteListProduct(ids), {
          successMessage: "Selected rows deleted successfully!",
          errorMessage: "Failed to delete selected rows",
          reloadKey: "/products",
        });
        //mutate data when delete/update product
        // Revalidate any SWR keys related to products (handles both '/products' and ['/products', page, pageSize])
        await mutate(
          (key) => {
            if (typeof key === "string" && key === "/products") return true;
            if (Array.isArray(key) && key[0] === "/products") return true;
            return false;
          },
          undefined,
          { revalidate: true },
        );
        table.resetRowSelection();
      } catch {
        toast.error("Failed to delete selected rows");
      }
      return;
    }
    toast.warning("No row selected");
  };
  // const handleSeeds = async () => {
  //   const res = await seeds();
  //   if (!res.ok) return toast.error(`${JSON.stringify(res)}`);
  //   toast.success("Successfully seeded!");
  //   router.refresh();
  // };
 
  const data_export = () => {
    const items = table.getRowModel().rows.map((row) => {
      const original = row.original as ProductData;
      const value = {
        id: original.id,
        name: original.name,
        category: original.category?.title ?? "",
        thumbnail:
          original.thumbnail !== ""
            ? (process.env.NEXT_PUBLIC_BASE_URL ?? "") + original.thumbnail
            : "",
        price: Number(original.price),
        stock: original.stock,
        active: original.active ? "Active" : "Inactive",
      } as DataExportType;
      return value;
    });
    return items;
  };
  // console.log("data export", data_export());
  return (
    <div className="overflow-hidden rounded-md">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mx-2"
        />

        <Select
          value={
            (table.getColumn("category")?.getFilterValue() as string) || " "
          }
          onValueChange={(value) => {
            //console.log("value", value);
            if (value === " " || value === "-") {
              table.getColumn("category")?.setFilterValue("");
            } else {
              table.getColumn("category")?.setFilterValue(value);
            }
          }}
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
              <SelectItem value=" ">Select Category</SelectItem>
              {categories.map((category, i) => (
                <SelectItem key={i} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={""}
          onValueChange={(value) => {
            console.log(`process export data as ${value} type file`);
            if (value === TypeFile.xlsx) {
              const fileName = "products_" + Date.now().toString();
              export_data(data_export(), fileName, TypeFile.xlsx);
            }
            if (value === TypeFile.csv) {
              const fileName = "products_" + Date.now().toString();
              export_data(data_export(), fileName, TypeFile.csv);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Export to" />
          </SelectTrigger>
          <SelectContent
            position={alignItemWithTrigger ? "item-aligned" : "popper"}
          >
            <SelectGroup>
              {/* <SelectItem value=" ">Export to</SelectItem> */}

              <SelectItem value={"xlsx"}>XLSX</SelectItem>
              <SelectItem value={"csv"}>CSV</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Export csvData={data} fileName="products" exportType="xlsx" /> */}
        <div className="p-4 flex flex-row justify-between items-center gap-2">
          {/* <Button
            variant="destructive"
            size={"default"}
            onClick={handleClickDeleteSelected}
          >
            <TrashIcon className="" />
          </Button> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Warning</DialogTitle>
                <DialogDescription>
                  This action will delete all selected rows
                </DialogDescription>
              </DialogHeader>
              {/* <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">Confirm delete</div>
              </div> */}
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button" onClick={handleClickDeleteSelected}>
                    Confirn
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button variant="link" size={"sm"} onClick={handleSeeds}>
            <CloudSync className="" />
            <span>Seed Data</span>
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ChevronsUpDown className="mr-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <Table className="overflow-hidden rounded-md border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
