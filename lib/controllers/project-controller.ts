import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { requireAuth, requireRole } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import { User } from "@/models/User";
import { AppError } from "@/utils/errors";
import { parseBody } from "@/lib/api/parse-body";
import { projectSchema } from "@/validations/project";

function ensureValidMemberIds(memberIds: string[]) {
  const invalidMemberId = memberIds.find((memberId) => !mongoose.Types.ObjectId.isValid(memberId));

  if (invalidMemberId) {
    throw new AppError("Project members must be selected from the user list.", 400);
  }
}

async function ensureMembersExist(memberIds: string[]) {
  if (memberIds.length === 0) {
    return;
  }

  const existingMembers = await User.countDocuments({ _id: { $in: memberIds } });
  if (existingMembers !== memberIds.length) {
    throw new AppError("One or more selected members no longer exist.", 400);
  }
}

export async function listProjects() {
  await connectToDatabase();
  const user = requireAuth();
  const query = user.role === "Admin"
    ? { isDeleted: false }
    : { isDeleted: false, $or: [{ createdBy: user.id }, { members: user.id }] };

  const projects = await Project.find(query)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  return projects;
}

export async function createProject(request: NextRequest) {
  await connectToDatabase();
  const user = requireAuth();
  requireRole(user, ["Admin", "Manager"]);
  const payload = await parseBody(request, projectSchema);

  ensureValidMemberIds(payload.members ?? []);
  await ensureMembersExist(payload.members ?? []);

  const project = await Project.create({
    ...payload,
    createdBy: user.id,
    members: Array.from(new Set([user.id, ...(payload.members ?? [])]))
  });

  return project.populate("members", "name email role");
}

export async function updateProject(id: string, request: NextRequest) {
  await connectToDatabase();
  const user = requireAuth();
  requireRole(user, ["Admin", "Manager"]);
  const payload = await parseBody(request, projectSchema);

  ensureValidMemberIds(payload.members ?? []);
  await ensureMembersExist(payload.members ?? []);

  const project = await Project.findOne({ _id: id, isDeleted: false });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (user.role !== "Admin" && `${project.createdBy}` !== user.id) {
    throw new AppError("You can only edit your own projects", 403);
  }

  project.title = payload.title;
  project.description = payload.description;
  project.members = Array.from(new Set([`${project.createdBy}`, ...(payload.members ?? [])])) as any;
  await project.save();

  return project.populate("members", "name email role");
}

export async function deleteProject(id: string) {
  await connectToDatabase();
  const user = requireAuth();
  requireRole(user, ["Admin", "Manager"]);

  const project = await Project.findById(id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (user.role !== "Admin" && `${project.createdBy}` !== user.id) {
    throw new AppError("You can only delete your own projects", 403);
  }

  project.isDeleted = true;
  await project.save();
  return project;
}

export async function getProjectAnalytics() {
  await connectToDatabase();
  const user = requireAuth();
  const projectMatch = user.role === "Admin"
    ? { isDeleted: false }
    : { isDeleted: false, $or: [{ createdBy: user.id }, { members: user.id }] };

  const [projects, tasks, members] = await Promise.all([
    Project.countDocuments(projectMatch),
    Task.countDocuments(),
    User.countDocuments()
  ]);

  return { projects, tasks, members };
}
