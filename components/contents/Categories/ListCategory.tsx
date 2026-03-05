"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategories, getListEmployee } from "@/lib/data";
import { useState } from "react";
import useSWR, { mutate } from "swr";

import { columns } from "@/components/contents/Categories/Datatable/columns";
import { DataTable } from "@/components/contents/Categories/Datatable/data-table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import swrConfig from "@/lib/swr-config";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export function LoadingTable() {
  return (
    <Table className="min-w-full">
      <TableCaption>Users</TableCaption>
      <TableHeader className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900">
        <TableRow>
          <TableHead className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900">
            F.Name
          </TableHead>
          <TableHead className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900">
            Email
          </TableHead>
          <TableHead className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900">
            Phone
          </TableHead>
          <TableHead className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900">
            Job Title
          </TableHead>
          <TableHead className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900 text-right">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-light">
            <Spinner />
          </TableCell>
          <TableCell className="text-start">
            <Spinner />
          </TableCell>
          <TableCell>
            <Spinner />
          </TableCell>
          <TableCell>
            <Spinner />
          </TableCell>
          <TableCell className="text-center col-span-2">
            <Spinner />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
export default function ListCategory() {
  // handle pagination
  const [pageCurrent, setPageCurrent] = useState(1);
  const [numOfPage, setNumOfPage] = useState(10);

  const { data, isLoading } = useSWR(
    ["/categories", pageCurrent, numOfPage],
    () =>
      getCategories({
        page: pageCurrent,
        pageSize: numOfPage,
        search: "",
        sortBy: "title",
        sortDirection: "desc",
      }),
    {
      suspense: true,
      fallbackData: { list: [], total: 0, totalPage: 0, page: 1, pageSize: numOfPage },
      ...swrConfig,
    },
  );
  const totalPages = Math.ceil(data?.total / numOfPage);

  const handlePageClick = (page: number) => {
    if (page === pageCurrent) {
      return;
    }
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    setPageCurrent(page);
    mutate(["/categories", page, numOfPage], () =>
      getCategories({
        page,
        pageSize: numOfPage,
        search: "",
        sortBy: "createdAt",
        sortDirection: "desc",
      }),
    );
  };

  // Generate pagination showing 5 pages centered on current page
  const paginationButtons = [];

  // Calculate start and end page to show 5 pages near current page
  let startPage: number;
  let endPage: number;

  if (totalPages <= 5) {
    // If 5 or fewer pages, show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // Try to center current page with 2 pages on each side
    startPage = Math.max(pageCurrent - 2, 1);
    endPage = Math.min(startPage + 4, totalPages);

    // Adjust if we're near the end
    if (endPage === totalPages && totalPages - startPage < 4) {
      startPage = Math.max(totalPages - 4, 1);
    }
  }

  // Add ellipsis at the beginning if needed
  if (startPage > 1) {
    paginationButtons.push(
      <Button variant={"link"} key="1" onClick={() => handlePageClick(1)}>
        1
      </Button>,
    );
    if (startPage > 2) {
      paginationButtons.push(<span key="ellipsis-start">...</span>);
    }
  }

  // Add page buttons
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(
      <Button
        variant={i === pageCurrent ? "default" : "link"}
        className={clsx(
          i === pageCurrent &&
            "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
        )}
        key={i}
        onClick={() => handlePageClick(i)}
      >
        {i}
      </Button>,
    );
  }

  // Add ellipsis at the end if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationButtons.push(<span key="ellipsis-end">...</span>);
    }
    paginationButtons.push(
      <Button
        variant={"link"}
        key={totalPages}
        onClick={() => handlePageClick(totalPages)}
      >
        {totalPages}
      </Button>,
    );
  }

  return (
    // wrapper provides a constrained height and enables vertical scrolling
    <div className="w-full border rounded-md">
      <div className="overflow-y-auto max-h-[80vh]">
        {isLoading && <Spinner />}
        <DataTable columns={columns} data={data?.list || []} />
      </div>
      <div className="mx-auto my-4">
        <div className="my-2">
          <Label htmlFor="rows-per-page" className="text-sm font-medium mb-2">
            Rows per page
          </Label>
          <Select
            value={numOfPage.toString()}
            onValueChange={(value) => {
              setNumOfPage(parseInt(value));
              setPageCurrent(1); // Reset to first page when page size changes
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder="Number of rows per page" />
            </SelectTrigger>
            <SelectContent side="top">
              {[2, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {/* <PaginationPrevious href="#"  /> */}
              <Button
                variant={"link"}
                disabled={pageCurrent === 1}
                onClick={() => handlePageClick(pageCurrent - 1)}
              >
                Previous
              </Button>
            </PaginationItem>

            {paginationButtons}
            <PaginationItem>
              <Button
                variant={"link"}
                disabled={pageCurrent === totalPages}
                onClick={() => handlePageClick(pageCurrent + 1)}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
