import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { getDashboardMetrics } from "@/lib/controllers/dashboard-controller";

export const GET = asyncHandler(async () => {
  const metrics = await getDashboardMetrics();
  return jsonResponse({ success: true, data: metrics, message: "Dashboard metrics fetched" });
});
