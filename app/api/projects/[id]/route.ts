import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { deleteProject, updateProject } from "@/lib/controllers/project-controller";

export const PATCH = asyncHandler(async (request, context) => {
  const { params } = context as { params: { id: string } };
  const project = await updateProject(params.id, request);
  return jsonResponse({ success: true, data: project, message: "Project updated" });
});

export const DELETE = asyncHandler(async (_request, context) => {
  const { params } = context as { params: { id: string } };
  const project = await deleteProject(params.id);
  return jsonResponse({ success: true, data: project, message: "Project deleted" });
});
