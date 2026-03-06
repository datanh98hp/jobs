import product, { FilterProduct, ProductCreate } from "@/data/product";

// Serialize data: convert BigInt to string and ensure plain objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // const name = form.get("name");
  // const categoryId = form.get("categoryId");
  // const thumbnailFile = form.get("thumbnail") as File;
  // const price = Number(form.get("price"));
  // const stock = Number(form.get("stock"));
  // const active = Boolean(form.get("active"));
  //const { name, categoryId, thumbnailFile, price, stock, active } = data;
  try {
    // console.log("data- route", data);
    // Upload thumbnail file if provided
    // let thumbnailPath = null;
    // if (thumbnailFile && thumbnailFile.size > 0) {
    //   thumbnailPath = await uploadThumbnail(thumbnailFile);
    // }

    await product.createOne(data as ProductCreate);

    return Response.json({ message: "success", status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create product",
        status: 500,
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
    const res = await product.getList({
      page,
      pageSize,
      search,
      sortBy,
      sortDirection,
    } as FilterProduct);
    const data = serializeData(res);
    return Response.json(data);
  } catch (error) {
    console.error("Products API error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { ids } = await request.json();
  
  try {
    const res = await product.deleteByList(ids);
    console.log("res route delete", res);
    // if (res.count > 0) {
    //   return Response.json(
    //     { message: "Delete product successfully !" },
    //     { status: 200 },
    //   );
    // }
    return Response.json({ error: "Product not deleted" }, { status: 400 });
  } catch (error) {
    console.log("res route delete error", error);
    return Response.json(
      { error: "Server error when deleting product" },
      { status: 500 },
    );
  }
}
