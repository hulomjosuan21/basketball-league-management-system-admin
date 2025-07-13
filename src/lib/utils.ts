import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDifferent<T>(a: T, b: T): boolean {
    return a !== b;
}

export function fromEnumValue<E extends Record<string, string>>(
  enumObj: E,
  value: string
): E[keyof E] {
  const match = Object.values(enumObj).find(v => v === value);
  if (!match) {
    throw new Error(`Invalid value "${value}" for enum`);
  }
  return match as E[keyof E];
}

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME = "node-handles-selected-style";

export function isValidUrl(url: string) {
	return /^https?:\/\/\S+$/.test(url);
}

export function duplicateContent(content: any) {
  return JSON.parse(JSON.stringify(content))
}