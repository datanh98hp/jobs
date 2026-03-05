import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

/**
 * Uploads and saves a file to the public folder
 * @param file - The file to upload
 * @param folder - The subfolder in public directory (e.g., 'thumbnails')
 * @returns The relative path to the saved file
 */
export async function uploadFile(
  file: File,
  folder: string = "uploads",
): Promise<string> {
  try {
    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${random}.${extension}`

    // Create the directory path
    const uploadDir = join(process.cwd(), "public", folder)

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true })

    // Write file to public folder
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return the relative path (for accessing via web)
    return `/${folder}/${filename}`
  } catch (error) {
    console.error("File upload error:", error)
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Uploads and saves an image thumbnail
 * @param file - The image file to upload
 * @returns The relative path to the saved image
 * @throws Error if file type is invalid or size exceeds 10MB
 */
export async function uploadThumbnail(file: File): Promise<string> {
  // Validate file type
  const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
  if (!validImageTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${validImageTypes.join(", ")}`,
    )
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB")
  }

  return uploadFile(file, "thumbnails")
}
