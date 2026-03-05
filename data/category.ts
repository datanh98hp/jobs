import { prisma } from "@/lib/prisma";

// Serialization utility for handling BigInt and Decimal
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeData(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      // Convert BigInt to string
      if (typeof value === "bigint") {
        return value.toString();
      }
      // Convert Decimal to number
      if (value && typeof value === "object" && "toNumber" in value) {
        return value.toNumber();
      }
      // Convert Date to ISO string
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }),
  );
}

export interface FilterCategory {
  page?: number;
  pageSize?: number;
  search?: string; // keyword
  sortBy: "title" | "createdAt" | "updatedAt";
  sortDirection?: "asc" | "desc";
}
export interface CategoryCreate {
  title: string;
}
export interface CategoryUpdate {
  title: string;
}
export interface CategoryResponse {
  id: string;
  title: string;
}
export interface FilterCategoriesResponse {
  id: string;
  title: string;
}
const getListByCategory = async (filter: FilterCategory) => {
  const {
    page = 1,
    pageSize = 10,
    search,
    sortBy = "title",
    sortDirection,
  } = filter;
  //s console.log("--log filter", filter);
  try {
    // setTimeout(() => {}, 3000);
    const list = await prisma.category.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortDirection,
      },
      where: {
        OR: [{ title: { contains: search, mode: "insensitive" } }],
      },
      // select: {
      //   id: true,
      //   title: true,
      //   products: {
      //     select: {
      //       id: true,
      //       name: true,
      //       thumbnail: true,
      //       price: true,
      //       stock: true,
      //       active: true,
      //     },
      //   },
      // }
    });
    const total = await prisma.category.count();
    const totalPage = Math.ceil(total / pageSize);
    const data = {
      list: serializeData(list),
      total,
      totalPage,
      page,
      pageSize,
    };
    //console.log("res pagination:", data);
    // console.log("--log employee", employees);
    return data;
  } catch (error) {
    return {
      error: "Get list failed" + error,
    };
  }
};
const createOne = async (data: CategoryCreate) => {
  const res = await prisma.category.create({
    data,
  });

  return serializeData(res);
};
const getById = async (id: string) => {
  const res = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!res) {
    return {
      error: "Not found",
    };
  }
  return serializeData(res);
};
const updateById = async (id: string, data: CategoryUpdate) => {
  //update category by id
  try {
    const res = await prisma.category.update({
      where: {
        id: id,
      },
      data: data,
    });

    return serializeData(res);
  } catch (error) {
    return error;
  }
};
const deleteByList = async (ids: string[]) => {
  try {
    const res = await prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (res.count === 0) {
      return {
        error: "Not found",
      };
    }
    return res;
  } catch {
    return {
      depend: "products",
      error: "Can not delete category, that category has products",
    };
  }
};

export const category = {
  getListByCategory,
  createOne,
  getById,
  updateById,
  deleteByList,
};
