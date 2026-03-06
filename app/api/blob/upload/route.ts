/* eslint-disable @typescript-eslint/no-explicit-any */
import { put,del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "";

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  const ext = filename.split(".").pop()?.split("?")[0];
  const fileName = Date.now() + "-" + filename.split("/").pop()?.split("?")[0];
  // ⚠️ The below code is for App Router Route Handlers only
  const blob = await put(`${fileName}.${ext}`, request.body as any, {
    access: "public",
    token: process.env.job_READ_WRITE_TOKEN,
  });

  // Here's the code for Pages API Routes:
  // const blob = await put(filename, request, {
  //   access: 'public',
  // });
  return NextResponse.json(blob);
}

// The next lines are required for Pages API Routes only
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
 
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get('url') as string;
  await del(urlToDelete);
 
  return new Response();
}