import { mutate } from "swr"
import { toast } from "sonner"

export interface MutationOptions {
  successMessage?: string
  errorMessage?: string
  reloadKey?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Handles mutation with automatic data reloading
 * @param mutationFn - The mutation function to execute
 * @param options - Configuration options
 * @returns Result of the mutation
 */
export async function handleMutation<T>(
  mutationFn: () => Promise<T>,
  options: MutationOptions = {},
) {
  const {
    successMessage = "Operation successful",
    errorMessage = "Operation failed",
    reloadKey,
    onSuccess,
    onError,
  } = options

  try {
    const result = await mutationFn() as { error?: string }

    // Show success toast
    toast.success(successMessage)

    // Reload data if key is provided
    if (reloadKey) {
      await mutate(reloadKey)
    }

    // Call success callback
    onSuccess?.()

    return result
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))

    // Show error toast
    toast.error(errorMessage)

    // Call error callback
    onError?.(err)

    throw err
  }
}

/**
 * Handles form submission with mutation and data reload
 * @param formData - The form data to submit
 * @param mutationFn - The mutation function
 * @param options - Configuration options
 */
export async function handleFormSubmit<T extends Record<string, unknown>>(
  formData: T,
  mutationFn: (data: T) => Promise<unknown>,
  options: MutationOptions = {},
) {
  return handleMutation(() => mutationFn(formData), options)
}
