import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { updateTask } from "@/lib/controllers/task-controller";

export const PATCH = asyncHandler(async (request, context) => {
  const { params } = context as { params: { id: string } };
  const task = await updateTask(params.id, request);
  return jsonResponse({ success: true, data: task, message: "Task updated" });
});
