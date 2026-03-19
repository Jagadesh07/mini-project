import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import { Notification } from "@/models/Notification";

export async function getDashboardMetrics() {
  await connectToDatabase();
  const user = requireAuth();

  const taskMatch = user.role === "Member" ? { assignedTo: user.id } : {};
  const projectMatch = user.role === "Admin"
    ? { isDeleted: false }
    : { isDeleted: false, $or: [{ createdBy: user.id }, { members: user.id }] };

  const [tasks, projects, unreadNotifications] = await Promise.all([
    Task.find(taskMatch).sort({ deadline: 1 }).populate("project", "title").populate("assignedTo", "name"),
    Project.find(projectMatch).sort({ createdAt: -1 }),
    Notification.countDocuments({ user: user.id, read: false })
  ]);

  const completed = tasks.filter((task) => task.status === "Completed").length;
  const overdue = tasks.filter(
    (task) => task.status !== "Completed" && new Date(task.deadline).getTime() < Date.now()
  ).length;

  const taskStats = [
    { name: "Todo", value: tasks.filter((task) => task.status === "Todo").length },
    { name: "In Progress", value: tasks.filter((task) => task.status === "In Progress").length },
    { name: "Completed", value: tasks.filter((task) => task.status === "Completed").length }
  ];

  return {
    summary: {
      totalTasks: tasks.length,
      totalProjects: projects.length,
      completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
      overdueTasks: overdue,
      unreadNotifications
    },
    taskStats,
    tasks,
    projects
  };
}
