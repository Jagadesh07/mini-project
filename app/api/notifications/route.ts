import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { listNotifications } from "@/lib/controllers/notification-controller";

export const GET = asyncHandler(async () => {
  const notifications = await listNotifications();
  return jsonResponse({ success: true, data: notifications, message: "Notifications fetched" });
});
