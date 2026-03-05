import { uploadImageThumbnail, validateImageFile } from "@/lib/upload"
import { useState, ChangeEvent, FormEvent } from "react"
import { toast } from "sonner"

export function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      try {
        validateImageFile(selectedFile, 10) // Validate: image, max 10MB
        setFile(selectedFile)
        toast.success("File selected and validated")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Invalid file")
        setFile(null)
        // Reset input
        e.target.value = ""
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast.error("Please select a file")
      return
    }

    setIsLoading(true)
    try {
      const filePath = await uploadImageThumbnail(file)
      setUploadedPath(filePath)
      toast.success("File uploaded successfully")
      setFile(null)
      // Reset input
      const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
      if (input) input.value = ""
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
        <button
          type="submit"
          disabled={!file || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploadedPath && (
        <div>
          <p className="text-sm text-green-600">Uploaded path: {uploadedPath}</p>
          <img
            src={uploadedPath}
            alt="Uploaded"
            className="mt-2 max-w-xs rounded"
          />
        </div>
      )}
    </div>
  )
}
