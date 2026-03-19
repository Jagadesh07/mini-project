import { Card } from "@/components/card";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { TaskStatusSelect } from "@/components/task-status-select";
import { TaskTimelineView } from "@/components/task-timeline-view";
import { getDashboardPageData } from "@/lib/dashboard-page-data";

export default async function TasksPage({
  searchParams
}: {
  searchParams: { search?: string; status?: string };
}) {
  const { user, dashboard } = await getDashboardPageData();
  const search = (searchParams.search || "").toLowerCase();
  const status = searchParams.status || "";
  const filteredTasks = dashboard.tasks.filter((task: any) => {
    const matchesSearch = !search || `${task.title} ${task.description}`.toLowerCase().includes(search);
    const matchesStatus = !status || task.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-8">
      <DashboardPageHeader
        eyebrow="Execution"
        title="Tasks"
        description="Search, filter, and update active work across the workspace."
      />

      <Card title="Timeline & Calendar" eyebrow="Schedule" className="animate-rise-delay-1">
        <TaskTimelineView
          tasks={filteredTasks.map((task: any) => ({
            _id: String(task._id),
            title: task.title,
            status: task.status,
            priority: task.priority,
            deadline: new Date(task.deadline).toISOString(),
            project: task.project ? { title: task.project.title } : null,
            assignedTo: task.assignedTo ? { name: task.assignedTo.name } : null
          }))}
        />
      </Card>

      <Card title="Task Board" eyebrow="Operations" className="animate-rise-delay-2">
        <form className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
          <input name="search" defaultValue={searchParams.search || ""} placeholder="Search tasks" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-700" />
          <select name="status" defaultValue={searchParams.status || ""} className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-700">
            <option value="">All statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </form>
        <div className="space-y-4">
          {filteredTasks.map((task: any) => (
            <div key={String(task._id)} className="rounded-[1.6rem] border border-slate-200/80 bg-white/75 p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-950/45">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-semibold text-ink dark:text-slate-100">{task.title}</p>
                  <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-ink/5 px-3 py-1 uppercase tracking-[0.24em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">{task.project?.title || "No project"}</span>
                    <span className="rounded-full bg-coral/10 px-3 py-1 text-coral">{task.priority}</span>
                  </div>
                </div>
                <div className="flex min-w-0 flex-col items-start gap-2 text-sm lg:items-end">
                  <TaskStatusSelect taskId={String(task._id)} currentStatus={task.status} disabled={user.role === "Member" && String(task.assignedTo?._id || task.assignedTo) !== user.id} />
                  <p className="break-words text-slate-500 dark:text-slate-400">Assigned: {task.assignedTo?.name || "Unknown"}</p>
                  <p className="break-words text-slate-500 dark:text-slate-400">Due: {new Date(task.deadline).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">No tasks matched the current filter.</p> : null}
        </div>
      </Card>
    </div>
  );
}
