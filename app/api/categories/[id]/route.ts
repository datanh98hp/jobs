import { category } from "@/data/category";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  //get employee by id
  try {
    const res = await category.getById(id);
    return Response.json(res);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  //update employee by id
  try {
    await category.updateById(id, body);

    return Response.json({
      ok: true,
      message: "User has been updated !",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Update Error", status: 500 });
  }
}
