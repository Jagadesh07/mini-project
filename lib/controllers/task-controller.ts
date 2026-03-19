import { NextRequest } from "next/server";
import { parseBody } from "@/lib/api/parse-body";
import { connectToDatabase } from "@/lib/db";
import { createNotification } from "@/lib/socket/notifications";
import { requireAuth, requireRole } from "@/middleware/auth";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import { taskSchema, taskUpdateSchema } from "@/validations/task";
import { AppError } from "@/utils/errors";

function buildTaskQuery(userId: string, role: string, search: string | null, status: string | null) {
  const query: Record<string, unknown> = {};

  if (role === "Member") {
    query.assignedTo = userId;
  }

  if (search) {
    query.$text = { $search: search };
  }

  if (status) {
    query.status = status;
  }

  return query;
}

export async function listTasks(request: NextRequest) {
  await connectToDatabase();
  const user = requireAuth();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const tasks = await Task.find(buildTaskQuery(user.id, user.role, search, status))
    .populate("project", "title")
    .populate("assignedTo", "name email role")
    .sort({ deadline: 1 });

  return tasks;
}

export async function createTask(request: NextRequest) {
  await connectToDatabase();
  const user = requireAuth();
  requireRole(user, ["Admin", "Manager"]);
  const payload = await parseBody(request, taskSchema);

  const project = await Project.findOne({ _id: payload.project, isDeleted: false });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const task = await Task.create({
    ...payload,
    deadline: new Date(payload.deadline)
  });

  await createNotification({
    userId: payload.assignedTo,
    message: `You have been assigned a new task: ${payload.title}`,
    relatedTask: task._id
  });

  return task.populate(["project", "assignedTo"]);
}

export async function updateTask(id: string, request: NextRequest) {
  await connectToDatabase();
  const user = requireAuth();
  const payload = await parseBody(request, taskUpdateSchema);
  const task = await Task.findById(id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const canEdit = user.role !== "Member" || `${task.assignedTo}` === user.id;
  if (!canEdit) {
    throw new AppError("You can only update your assigned tasks", 403);
  }

  Object.assign(task, payload);
  if (payload.deadline) {
    task.deadline = new Date(payload.deadline);
  }
  await task.save();

  await createNotification({
    userId: `${task.assignedTo}`,
    message: `Task status updated to ${task.status}: ${task.title}`,
    relatedTask: task._id
  });

  if (task.deadline.getTime() - Date.now() <= 24 * 60 * 60 * 1000) {
    await createNotification({
      userId: `${task.assignedTo}`,
      message: `Deadline approaching within 24 hours for task: ${task.title}`,
      relatedTask: task._id
    });
  }

  return task.populate(["project", "assignedTo"]);
}
