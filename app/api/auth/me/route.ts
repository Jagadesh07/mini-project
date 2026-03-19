import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { requireAuth } from "@/middleware/auth";
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/lib/controllers/auth-controller";

export const GET = asyncHandler(async () => {
  const user = requireAuth();
  const profile = await getCurrentUserProfile(user.id);
  return jsonResponse({ success: true, data: profile, message: "Authenticated user fetched" });
});

export const PATCH = asyncHandler(async (request) => {
  const user = requireAuth();
  const result = await updateCurrentUserProfile(user.id, request);
  const response = jsonResponse({ success: true, data: result.user, message: "Profile updated" });

  result.cookies.forEach((cookie) => response.cookies.set(cookie));
  return response;
});
