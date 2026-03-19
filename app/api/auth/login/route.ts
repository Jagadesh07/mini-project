import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { loginUser } from "@/lib/controllers/auth-controller";

export const POST = asyncHandler(async (request) => {
  const result = await loginUser(request);
  const response = jsonResponse(
    { success: true, data: result.user, message: "Login successful" },
    200
  );

  result.cookies.forEach((cookie) => response.cookies.set(cookie));
  return response;
});
