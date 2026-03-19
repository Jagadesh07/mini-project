import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { markNotificationRead } from "@/lib/controllers/notification-controller";

export const PATCH = asyncHandler(async (_request, context) => {
  const { params } = context as { params: { id: string } };
  const notification = await markNotificationRead(params.id);
  return jsonResponse({ success: true, data: notification, message: "Notification marked as read" });
});
