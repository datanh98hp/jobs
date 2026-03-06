import path from "path";
import fs from "fs";

/**
 * Validates if a file is a valid image and within size limit
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @throws Error if validation fails
 */
export function validateImageFile(file: File, maxSizeMB: number = 10): void {
  // Check file type
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  if (!validImageTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${validImageTypes.join(", ")}`,
    );
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }
}

/**
 * Uploads a file to the server
 * @param file - The file to upload
 * @param type - The type/folder for the file (e.g., 'thumbnail', 'thumbnails')
 * @returns The file path on the server
 */
export async function uploadFileToServer(
  file: File,
  type: string = "thumbnails",
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload file");
  }

  const data = await response.json();
  return data.filePath;
}

/**
 * Uploads a thumbnail image file
 * @param file - The image file to upload
 * @returns The thumbnail file path on the server
 * @throws Error if file validation fails
 */
export async function uploadImageThumbnail(file: File): Promise<string> {
  validateImageFile(file, 10); // Validate: image file, max 10MB
  return uploadFileToServer(file, "thumbnail");
}

