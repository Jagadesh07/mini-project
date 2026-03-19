import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { logoutUser } from "@/lib/controllers/auth-controller";

export const POST = asyncHandler(async () => {
  const result = await logoutUser();
  const response = jsonResponse(
    { success: true, data: null, message: "Logged out successfully" },
    200
  );

  result.cookies.forEach((cookie) => response.cookies.set(cookie));
  return response;
});
