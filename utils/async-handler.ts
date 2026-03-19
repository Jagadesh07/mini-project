import { NextRequest } from "next/server";
import { jsonResponse } from "@/utils/api";
import { AppError, getErrorMessage } from "@/utils/errors";

type Handler = (request: NextRequest, context?: unknown) => Promise<Response>;

export function asyncHandler(handler: Handler) {
  return async (request: NextRequest, context?: unknown) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const message = getErrorMessage(error);
      const status = error instanceof AppError ? error.statusCode : 500;

      return jsonResponse(
        {
          success: false,
          data: null,
          message: "Request failed",
          error: message
        },
        status
      );
    }
  };
}
