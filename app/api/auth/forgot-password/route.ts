import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { forgotPassword } from "@/lib/controllers/auth-controller";

export const POST = asyncHandler(async (request) => {
  const result = await forgotPassword(request);
  return jsonResponse(
    { success: true, data: result, message: "Reset flow simulated" },
    200
  );
});
