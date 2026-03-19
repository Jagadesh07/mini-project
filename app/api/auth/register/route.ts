import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { registerUser } from "@/lib/controllers/auth-controller";

export const POST = asyncHandler(async (request) => {
  const result = await registerUser(request);
  const response = jsonResponse(
    { success: true, data: result.user, message: "Registration successful" },
    201
  );

  result.cookies.forEach((cookie) => response.cookies.set(cookie));
  return response;
});
