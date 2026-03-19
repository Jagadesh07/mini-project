import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card } from "@/components/card";
import { CreateProjectForm } from "@/components/create-project-form";
import { CreateTaskForm } from "@/components/create-task-form";
import { LogoutButton } from "@/components/logout-button";
import { NotificationPanel } from "@/components/notification-panel";
import { StatsChart } from "@/components/stats-chart";
import { TaskStatusSelect } from "@/components/task-status-select";
import { connectToDatabase } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/controllers/dashboard-controller";
import { Notification } from "@/models/Notification";
import { User } from "@/models/User";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { search?: string; status?: string };
}) {
  const token = cookies().get("stm_access")?.value;
  if (!token) {
    redirect("/login");
  }

  const user = verifyAccessToken(token);
  await connectToDatabase();
  const [dashboard, notifications, users] = await Promise.all([
    getDashboardMetrics(),
    Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(10).lean(),
    User.find({}, "name email role").sort({ createdAt: -1 }).lean()
  ]);

  const search = (searchParams.search || "").toLowerCase();
  const status = searchParams.status || "";
  const filteredTasks = dashboard.tasks.filter((task: any) => {
    const matchesSearch = !search || `${task.title} ${task.description}`.toLowerCase().includes(search);
    const matchesStatus = !status || task.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-[2rem] bg-ink px-8 py-8 text-white shadow-soft lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Control Center</p>
          <h1 className="mt-3 font-display text-4xl">Welcome back, {user.name}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Track delivery velocity, assign work, and keep the team in sync through real-time notifications.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/10 px-4 py-2">Role: {user.role}</span>
          <LogoutButton />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card title={`${dashboard.summary.totalTasks}`} eyebrow="Tasks"><p className="text-sm text-slate-500">Total tracked tasks</p></Card>
        <Card title={`${dashboard.summary.totalProjects}`} eyebrow="Projects"><p className="text-sm text-slate-500">Active non-deleted projects</p></Card>
        <Card title={`${dashboard.summary.completionRate}%`} eyebrow="Completion"><p className="text-sm text-slate-500">Overall completion rate</p></Card>
        <Card title={`${dashboard.summary.overdueTasks}`} eyebrow="Overdue"><p className="text-sm text-slate-500">Open tasks past deadline</p></Card>
        <Card title={`${dashboard.summary.unreadNotifications}`} eyebrow="Unread"><p className="text-sm text-slate-500">Notifications awaiting review</p></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card title="Task Distribution" eyebrow="Analytics">
          <StatsChart data={dashboard.taskStats} />
        </Card>
        <Card title="Live Notifications" eyebrow="Realtime">
          <NotificationPanel userId={user.id} notifications={notifications.map((item: any) => ({ ...item, _id: String(item._id), createdAt: new Date(item.createdAt).toISOString() }))} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {(user.role === "Admin" || user.role === "Manager") ? (
          <Card title="Create Project" eyebrow="Managers">
            <CreateProjectForm
              users={users.map((member: any) => ({
                _id: String(member._id),
                name: member.name,
                email: member.email,
                role: member.role
              }))}
            />
          </Card>
        ) : null}
        {(user.role === "Admin" || user.role === "Manager") ? (
          <Card title="Create Task" eyebrow="Planning">
            <CreateTaskForm
              projects={dashboard.projects.map((project: any) => ({ _id: String(project._id), title: project.title }))}
              users={users.map((member: any) => ({ _id: String(member._id), name: member.name }))}
            />
          </Card>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card title="Task Board" eyebrow="Execution">
          <form className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
            <input name="search" defaultValue={searchParams.search || ""} placeholder="Search tasks" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <select name="status" defaultValue={searchParams.status || ""} className="rounded-2xl border border-slate-200 px-4 py-3">
              <option value="">All statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </form>
          <div className="space-y-4">
            {filteredTasks.map((task: any) => (
              <div key={String(task._id)} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">{task.project?.title || "No project"}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-sm md:items-end">
                    <TaskStatusSelect taskId={String(task._id)} currentStatus={task.status} disabled={user.role === "Member" && String(task.assignedTo?._id || task.assignedTo) !== user.id} />
                    <p className="text-slate-500">Priority: {task.priority}</p>
                    <p className="text-slate-500">Due: {new Date(task.deadline).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 ? <p className="text-sm text-slate-500">No tasks matched the current filter.</p> : null}
          </div>
        </Card>
        <Card title="Project Portfolio" eyebrow="Scope">
          <div className="space-y-4">
            {dashboard.projects.map((project: any) => (
              <div key={String(project._id)} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{project.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                  </div>
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-ink">Active</span>
                </div>
              </div>
            ))}
            {dashboard.projects.length === 0 ? <p className="text-sm text-slate-500">No projects created yet.</p> : null}
          </div>
        </Card>
      </section>
    </div>
  );
}
