import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts FormData to a JSON object
 * @param formData - The FormData object to convert
 * @returns A JSON object with form field values
 */
export function formDataToJson(formData: FormData): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (json[key]) {
      // If key already exists, convert to array
      if (Array.isArray(json[key])) {
        json[key].push(value);
      } else {
        json[key] = [json[key], value];
      }
    } else {
      json[key] = value;
    }
  });

  return json;
}

export function getTimeString() {
  const now = new Date();

  const formatted = now.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatted;
}
