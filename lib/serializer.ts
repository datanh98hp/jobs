/**
 * Serialization utility for converting non-JSON types to JSON-serializable format
 * Handles BigInt, Decimal, Date, and other Prisma types
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeData(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      // Convert BigInt to string
      if (typeof value === "bigint") {
        return value.toString();
      }
      // Convert Prisma Decimal to number
      if (value && typeof value === "object" && "toNumber" in value) {
        return value.toNumber();
      }
      // Convert Date to ISO string
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }),
  );
}

/**
 * Serialize a single value, handling various types
 * @param value - The value to serialize
 * @returns The serialized value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeValue(value: any): any {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value && typeof value === "object" && "toNumber" in value) {
    return value.toNumber();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

/**
 * Serialize an array of objects
 * @param list - Array of objects to serialize
 * @returns Serialized array
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeList(list: any[]): any[] {
  return list.map((item) => serializeData(item));
}
