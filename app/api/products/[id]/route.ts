/* eslint-disable @typescript-eslint/no-explicit-any */
import product from "@/data/product";
function serializeData(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_k, v) => {
      if (typeof v === "bigint") return v.toString();
      if (v instanceof Date) return v.toISOString();
      return v;
    }),
  );
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  //get product by id
  try {
    const res = await product.getById(id);
    const result = serializeData(res);
    //console.log("res", res);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "Get product error" }, { status: 500 });
  }
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  //console.log(`Updating product ${id} with data:`, body);

  //update product by id
  try {
    // Validate required fields
    if (!body.name || !body.categoryId) {
      return Response.json(
        {
          error: "Name and categoryId are required",
          status: 400,
        },
        { status: 400 },
      );
    }

    // Ensure numeric fields
    const updateData = {
      ...body,
      price: Number(body.price),
      stock: Number(body.stock),
    };

    const result = await product.updateById(id, updateData);

    if (result.error) {
      return Response.json(
        {
          error: result.error,
          status: 500,
        },
        { status: 500 },
      );
    }

    return Response.json({
      ok: true,
      message: "Product has been updated !",
      data: result.data,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("PUT Error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Update Error",
        status: 500,
      },
      { status: 500 },
    );
  }
}
function getById(id: string) {
  throw new Error("Function not implemented.");
}
