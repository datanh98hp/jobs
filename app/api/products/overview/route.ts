import product from "@/data/product";

export async function GET(request: Request) {
  // get overview of products with count, out of stock, and, count by categoryq
  try {
    const res = await product.getOverview();
    return Response.json(res, { status: 200 });
  } catch (error) {
    return Response.json(
      { error, message: "Provider null or undefined" },
      { status: 500 },
    );
  }
}
