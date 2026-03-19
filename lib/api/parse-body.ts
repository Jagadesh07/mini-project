import { NextRequest } from "next/server";
import { z } from "zod";
import { AppError } from "@/utils/errors";
import { sanitizeObject } from "@/utils/sanitize";

export async function parseBody<T>(request: NextRequest, schema: z.ZodSchema<T>) {
  const body = sanitizeObject(await request.json());
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new AppError(result.error.errors[0]?.message || "Invalid request body", 400);
  }

  return result.data;
}
