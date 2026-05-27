export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 25;
export const LIMIT_OPTIONS = [10, 25, 50, 100] as const;

export function parseInteger(value: unknown): number | null {
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return value;
    } else {
      return null;
    }
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (Number.isInteger(parsed)) {
      return parsed;
    } else {
      return null;
    }
  }
  return null;
}

export function parsePage(value: unknown): number {
  const parsed = parseInteger(value);
  if (parsed !== null && parsed >= 1) return parsed;
  return DEFAULT_PAGE;
}

export function parseLimit(value: unknown): number {
  const parsed = parseInteger(value);
  const limitOptions = LIMIT_OPTIONS as readonly number[];
  if (parsed !== null && limitOptions.includes(parsed)) return parsed;
  return DEFAULT_LIMIT;
}
