export function sanitizeText(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(payload: T) {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    result[key] = typeof value === "string" ? sanitizeText(value) : value;
  }

  return result as T;
}
