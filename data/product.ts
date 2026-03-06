/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import fs from "fs";
import { join } from "path";
import type { Product, Category } from "@/generated/prisma";

export interface FilterProduct {
  page?: number;
  pageSize?: number;
  search?: string; // keyword
  sortBy: "categoryId" | "price" | "name" | "createdAt" | "updatedAt";
  sortDirection?: "asc" | "desc";
}
export interface ProductCreate {
  name: string;
  categoryId: string;
  thumbnail?: string;
  price: number;
  stock: number;
  active?: boolean;
}
export interface ProductUpdate {
  name: string;
  categoryId: string;
  thumbnail?: string;
  price: number;
  stock: number;
  active?: boolean;
}
export interface ProductResponse {
  id: string;
  name: string;
  thumbnail: string;
  categoryId: string;
  price: number;
  stock: number;
  active: boolean;
}

export interface ProductOverviewDataRequest {
  status: boolean;
}
// Helper function to safely delete a thumbnail file
function safeDeleteFile(webPath: string | null | undefined) {
  if (!webPath || typeof webPath !== "string" || webPath.trim() === "") {
    return;
  }

  try {
    // Convert web path (e.g., /thumbnails/file.jpg) to file system path
    const filePath = join(process.cwd(), "public", webPath.replace(/^\//, ""));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete file: ${webPath}`, error);
  }
}

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

const getList = async (filter: FilterProduct) => {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;
  //s console.log("--log filter", filter);
  try {
    // setTimeout(() => {}, 3000);
    const list = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortDirection,
      },
      where: {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        price: true,
        stock: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const total = await prisma.product.count();
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
const createOne = async (data: ProductCreate) => {
  const res = await prisma.product.create({
    data,
  });

  return serializeData(res);
};
const getById = async (id: string) => {
  const res = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      price: true,
      stock: true,
      active: true,
    },
  });
  if (!res) {
    return {
      error: "Not found",
    };
  }
  return serializeData(res);
};

const updateById = async (id: string, data: ProductUpdate) => {
  //update product by id
  try {
    //console.log("data update data", data);
    // Validate required fields
    if (!data.name || !data.categoryId) {
      return { error: "Name and category are required" };
    }
    if (!data.thumbnail) {
      data.thumbnail = "";
    } else {
      //del thumnail image before
      const product = await prisma.product.findUnique({
        where: {
          id: id,
        },
        select: {
          thumbnail: true,
        },
      });
      const thumbnail = product?.thumbnail;
      safeDeleteFile(thumbnail);
    }
    //

    // Ensure numeric fields are numbers
    const updatePayload = {
      ...data,
      price: data.price,
      stock: data.stock,
    };

    const res = await prisma.product.update({
      where: {
        id: id,
      },
      data: updatePayload,
    });

    //console.log("res update", res);
    return { success: true, data: serializeData(res) };
  } catch (error) {
    console.error("Update error:", error);
    return { error: error instanceof Error ? error.message : "Update failed" };
  }
};
const deleteById = async (id: string) => {
  // del thumnail image before
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      thumbnail: true,
    },
  });
  const thumbnail = product?.thumbnail;

  // Delete the thumbnail file
  safeDeleteFile(thumbnail);

  //del user by id
  return await prisma.product
    .delete({
      where: {
        id: id,
      },
    })
    .then((data: Product) => {
      return data;
    })
    .catch((error: any) => {
      return error;
    });
};

const deleteByList = async (ids: string[]) => {
  //console.log("ids----", ids);
  // delete media thumnail before
  const items = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  for (const item of items) {
    safeDeleteFile(item.thumbnail);
  }
  ///
  const res = await prisma.product.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return res;
};

// const seeds = async () => {
//   try {
//     await prisma.employee.createMany({ data: data_example });
//     return {
//       ok: true,
//       message: "Seeds has been created !",
//     };
//   } catch (error) {
//     return error;
//   }
// };

const getOverview = async () => {
  try {
    const [
      total_products,
      instock_products,
      activated_products,
      count_category,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: {
          stock: {
            gt: 0,
          },
        },
      }),
      prisma.product.count({
        where: {
          active: true,
        },
      }),
      prisma.category.count(),
    ]);

    return {
      total_products,
      instock_products,
      activated_products,
      count_category,
    };
  } catch (error) {
    return error;
  }
};
const getCountProductFromCategory = async (
  filter: ProductOverviewDataRequest,
) => {
  const res = await prisma.category
    .findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                active: filter.status,
              },
            },
          },
        },
      },
    })
    .then((data: (Category & { _count: { products: number } })[]) => {
      return data.map((item) => ({
        id: item.id,
        name: item.title,
        count: item._count.products,
      }));
    })
    .catch((error: any) => {
      return error;
    });

  return res;
};
const product = {
  getList,
  createOne,
  getById,
  updateById,
  deleteById,
  deleteByList,
  getOverview,
  getCountProductFromCategory,

  // seeds,
};

export default product;
