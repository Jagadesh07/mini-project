import { asyncHandler } from "@/utils/async-handler";
import { jsonResponse } from "@/utils/api";
import { createProject, listProjects } from "@/lib/controllers/project-controller";

export const GET = asyncHandler(async () => {
  const projects = await listProjects();
  return jsonResponse({ success: true, data: projects, message: "Projects fetched" });
});

export const POST = asyncHandler(async (request) => {
  const project = await createProject(request);
  return jsonResponse({ success: true, data: project, message: "Project created" }, 201);
});
