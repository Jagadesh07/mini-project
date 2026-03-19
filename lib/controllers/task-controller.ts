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
  projectId,
  projectTitle
}: {
  actorId: string;
  actorName: string;
  taskId: string;
  taskTitle: string;
  nextStatus: string;
  projectId: string;
  projectTitle: string;
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

  const title = nextStatus === "Completed" ? "Task completed by member" : "Task status changed by member";
  const details = `${actorName} changed "${taskTitle}" to ${nextStatus} in project ${projectTitle}.`;
  const message = nextStatus === "Completed"
    ? `${actorName} completed task: ${taskTitle}`
    : `${actorName} updated task to ${nextStatus}: ${taskTitle}`;

  await Promise.all(
    managers.map((manager) =>
      createNotification({
        userId: String(manager._id),
        type: "status_change",
        title,
        details,
        message,
        relatedTask: taskId
      })
    )
  );
}

async function notifyInvolvedUsersAboutReschedule({
  actorId,
  actorName,
  taskId,
  taskTitle,
  projectId,
  projectTitle,
  assignedToId,
  previousDeadline,
  nextDeadline
}: {
  actorId: string;
  actorName: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectTitle: string;
  assignedToId: string;
  previousDeadline: Date;
  nextDeadline: Date;
}) {
  const project = await Project.findById(projectId).select("createdBy members").lean();
  if (!project) {
    return;
  }

  const stakeholderIds = Array.from(
    new Set(
      [
        assignedToId,
        String(project.createdBy),
        ...(project.members || []).map((memberId: any) => String(memberId))
      ].filter((id) => Boolean(id) && id !== actorId)
    )
  );

  if (stakeholderIds.length === 0) {
    return;
  }

  const title = "Task rescheduled";
  const details = `${actorName} moved "${taskTitle}" in project ${projectTitle} from ${previousDeadline.toLocaleString()} to ${nextDeadline.toLocaleString()}.`;
  const message = `Task rescheduled: ${taskTitle}`;

  await Promise.all(
    stakeholderIds.map((userId) =>
      createNotification({
        userId,
        type: "project_update",
        title,
        details,
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
    type: "assignment",
    title: "New task assigned",
    details: `You were assigned "${payload.title}" in project ${project.title}.`,
    message: `You have been assigned a new task: ${payload.title}`,
    relatedTask: task._id
  });

  return task.populate(["project", "assignedTo"]);
}

export async function updateTask(id: string, request: NextRequest) {
  await connectToDatabase();
  const user = requireAuth();
  const payload = await parseBody(request, taskUpdateSchema);
  const task = await Task.findById(id).populate("project", "title");

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const canEdit = user.role !== "Member" || `${task.assignedTo}` === user.id;
  if (!canEdit) {
    throw new AppError("You can only update your assigned tasks", 403);
  }

  const previousStatus = task.status;
  const previousDeadline = new Date(task.deadline);

  Object.assign(task, payload);
  if (payload.deadline) {
    task.deadline = new Date(payload.deadline);
  }
  await task.save();

  const statusChanged = previousStatus !== task.status;
  const deadlineChanged = previousDeadline.getTime() !== new Date(task.deadline).getTime();
  const projectTitle = (task.project as any)?.title || "Unknown project";

  await createNotification({
    userId: `${task.assignedTo}`,
    type: statusChanged ? "status_change" : deadlineChanged ? "project_update" : "system",
    title: statusChanged ? "Task status updated" : deadlineChanged ? "Task deadline updated" : "Task updated",
    details: statusChanged
      ? `"${task.title}" is now ${task.status} in project ${projectTitle}.`
      : deadlineChanged
        ? `Deadline moved to ${new Date(task.deadline).toLocaleString()} for "${task.title}" in ${projectTitle}.`
        : `Changes were saved for "${task.title}" in project ${projectTitle}.`,
    message: statusChanged
      ? `Task status updated to ${task.status}: ${task.title}`
      : deadlineChanged
        ? `Task deadline updated: ${task.title}`
        : `Task updated: ${task.title}`,
    relatedTask: task._id
  });

  if (deadlineChanged) {
    await notifyInvolvedUsersAboutReschedule({
      actorId: user.id,
      actorName: user.name,
      taskId: String(task._id),
      taskTitle: task.title,
      projectId: String((task.project as any)?._id || task.project),
      projectTitle,
      assignedToId: String(task.assignedTo),
      previousDeadline,
      nextDeadline: new Date(task.deadline)
    });
  }

  if (user.role === "Member" && statusChanged) {
    await notifyProjectManagersAboutMemberUpdate({
      actorId: user.id,
      actorName: user.name,
      taskId: String(task._id),
      taskTitle: task.title,
      nextStatus: task.status,
      projectId: String((task.project as any)?._id || task.project),
      projectTitle
    });
  }

  if (task.status !== "Completed" && task.deadline.getTime() - Date.now() <= 24 * 60 * 60 * 1000) {
    await createNotification({
      userId: `${task.assignedTo}`,
      type: "deadline",
      title: "Deadline approaching",
      details: `"${task.title}" in ${projectTitle} is due within the next 24 hours on ${new Date(task.deadline).toLocaleString()}.`,
      message: `Deadline approaching within 24 hours for task: ${task.title}`,
      relatedTask: task._id
    });
  }

  return task.populate(["project", "assignedTo"]);
}
