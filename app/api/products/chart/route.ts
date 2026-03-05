import product, { ProductOverviewDataRequest } from "@/data/product";

export async function POST(request: Request) {
  // try {
  const data = (await request.json()) as ProductOverviewDataRequest;
  // console.log("data --route", data);
  if (!data)
    return Response.json({ error: "Invalid input data" }, { status: 400 });
  const res = await product.getCountProductFromCategory(data);
  return Response.json(res, { status: 200 });
  //return Response.json({ message: "success" }, { status: 200 });
  // } catch {
  //   return Response.json({ error: "Get data error" }, { status: 500 });
  // }
}
