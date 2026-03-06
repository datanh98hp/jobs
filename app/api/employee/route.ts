import employee, { FilterEmployee } from "@/data/employee";

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
  const body = await request.json();
  try {
    await employee.createOne(body);

    return Response.json({ message: "success", status: 201 });
  } catch (error) {
    console.error("Employee creation error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
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
    const res = await employee.getList({
      page,
      pageSize,
      search,
      sortBy,
      sortDirection,
    } as FilterEmployee);
    const data = serializeData(res);
    // console.log("data route", data);
    return Response.json(data);
  } catch (error) {
    console.error("Employee API error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { ids } = await request.json();

  try {
    await employee.deleteByList(ids);
    return Response.json({ message: "success", status: 200 });
  } catch (error) {
    console.error("Employee deletion error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
