import { mutate } from "swr"

/**
 * Custom hook for reloading data after mutations
 * @returns Object with reload functions for different data types
 */
export function useDataReload() {
  /**
   * Reloads products data
   */
  const reloadProducts = async () => {
    await mutate("/products")
  }

  /**
   * Reloads employees data
   */
  const reloadEmployees = async () => {
    await mutate("/employees")
  }

  /**
   * Reloads any data by key
   * @param key - The SWR key (usually the API endpoint)
   */
  const reload = async (key: string) => {
    await mutate(key)
  }

  /**
   * Reloads multiple data keys
   * @param keys - Array of SWR keys to reload
   */
  const reloadMultiple = async (keys: string[]) => {
    await Promise.all(keys.map((key) => mutate(key)))
  }

  return {
    reloadProducts,
    reloadEmployees,
    reload,
    reloadMultiple,
  }
}
