import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { requireAuth } from "@/middleware/auth";

export const GET = asyncHandler(async () => {
  const user = requireAuth();
  return jsonResponse({ success: true, data: user, message: "Authenticated user fetched" });
});
