import { NextRequest } from "next/server";
import { parseBody } from "@/lib/api/parse-body";
import { connectToDatabase } from "@/lib/db";
import { createNotification } from "@/lib/socket/notifications";
import { requireAuth, requireRole } from "@/middleware/auth";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import { User } from "@/models/User";
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

async function notifyProjectManagersAboutMemberUpdate({
  actorId,
  actorName,
  taskId,
  taskTitle,
  nextStatus,
  projectId
}: {
  actorId: string;
  actorName: string;
  taskId: string;
  taskTitle: string;
  nextStatus: string;
  projectId: string;
}) {
  const project = await Project.findById(projectId).select("createdBy members").lean();
  if (!project) {
    return;
  }

  const managerIds = Array.from(
    new Set(
      [String(project.createdBy), ...(project.members || []).map((memberId: any) => String(memberId))].filter(Boolean)
    )
  );

  if (managerIds.length === 0) {
    return;
  }

  const managers = await User.find({
    _id: { $in: managerIds, $ne: actorId },
    role: "Manager"
  })
    .select("_id")
    .lean();

  if (managers.length === 0) {
    return;
  }

  const message = nextStatus === "Completed"
    ? `${actorName} completed task: ${taskTitle}`
    : `${actorName} updated task to ${nextStatus}: ${taskTitle}`;

  await Promise.all(
    managers.map((manager) =>
      createNotification({
        userId: String(manager._id),
        message,
        relatedTask: taskId
      })
    )
  );
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

  const previousStatus = task.status;

  Object.assign(task, payload);
  if (payload.deadline) {
    task.deadline = new Date(payload.deadline);
  }
  await task.save();

  const statusChanged = previousStatus !== task.status;

  await createNotification({
    userId: `${task.assignedTo}`,
    message: statusChanged
      ? `Task status updated to ${task.status}: ${task.title}`
      : `Task updated: ${task.title}`,
    relatedTask: task._id
  });

  if (user.role === "Member" && statusChanged) {
    await notifyProjectManagersAboutMemberUpdate({
      actorId: user.id,
      actorName: user.name,
      taskId: String(task._id),
      taskTitle: task.title,
      nextStatus: task.status,
      projectId: String(task.project)
    });
  }

  if (task.status !== "Completed" && task.deadline.getTime() - Date.now() <= 24 * 60 * 60 * 1000) {
    await createNotification({
      userId: `${task.assignedTo}`,
      message: `Deadline approaching within 24 hours for task: ${task.title}`,
      relatedTask: task._id
    });
  }

  return task.populate(["project", "assignedTo"]);
}
