import user from "@/data/employee";

export async function POST() {
  try {
    const res = await user.seeds();
    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
}
