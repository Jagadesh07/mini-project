import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { refreshUserToken } from "@/lib/controllers/auth-controller";

export const POST = asyncHandler(async () => {
  const result = await refreshUserToken();
  const response = jsonResponse(
    { success: true, data: result.user, message: "Token refreshed" },
    200
  );

  result.cookies.forEach((cookie) => response.cookies.set(cookie));
  return response;
});
