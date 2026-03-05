/* eslint-disable @typescript-eslint/no-explicit-any */
import { category, CategoryCreate, FilterCategory } from "@/data/category";
function serializeData(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_k, v) => {
      if (typeof v === "bigint") return v.toString();
      if (v instanceof Date) return v.toISOString();
      return v;
    }),
  );
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    await category.createOne({
      title: data.title,
    } as CategoryCreate);

    return Response.json({ message: "success", status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return Response.json(
      {
        error: "Failed to create category",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") as string) || 1;
  const pageSize = parseInt(searchParams.get("pageSize") as string) || 10;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortDirection = searchParams.get("sortDirection") || "desc";
  try {
    const res = await category.getListByCategory({
      page,
      pageSize,
      search,
      sortBy,
      sortDirection,
    } as FilterCategory);
    const data = serializeData(res);
    return Response.json(data);
  } catch (error) {
    return Response.json({ error, status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { ids } = await request.json();
  try {
    const res = (await category.deleteByList(ids)) as any;
    console.log("res route delete", res);
    if (res.depend) return Response.json(res, { status: 400 });
    return Response.json({ message: "success" }, { status: 200 });
  } catch {
    return Response.json(
      { error: "Server error when deleting category" },
      { status: 500 },
    );
  }
}
