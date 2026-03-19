import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { createTask, listTasks } from "@/lib/controllers/task-controller";

export const GET = asyncHandler(async (request) => {
  const tasks = await listTasks(request);
  return jsonResponse({ success: true, data: tasks, message: "Tasks fetched" });
});

export const POST = asyncHandler(async (request) => {
  const task = await createTask(request);
  return jsonResponse({ success: true, data: task, message: "Task created" }, 201);
});
