import { uploadThumbnail, uploadFile } from "@/lib/file-handler"

export async function POST(request: Request) {
  const form = await request.formData()
  const file = form.get("file") as File
  const type = form.get("type") as string || "thumbnails"

  try {
    if (!file) {
      return Response.json(
        { error: "No file provided", status: 400 },
        { status: 400 },
      )
    }

    let filePath: string

    // Handle different file types
    if (type === "thumbnail") {
      filePath = await uploadThumbnail(file)
    } else {
      filePath = await uploadFile(file, type)
    }

    return Response.json(
      { message: "File uploaded successfully", filePath, status: 200 },
      { status: 200 },
    )
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
        status: 500,
      },
      { status: 500 },
    )
  }
}
