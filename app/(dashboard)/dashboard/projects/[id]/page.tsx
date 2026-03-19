import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/card";
import { CreateTaskForm } from "@/components/create-task-form";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ProjectDetailActions } from "@/components/project-detail-actions";
import { getProjectById } from "@/lib/controllers/project-controller";
import { getDashboardPageData } from "@/lib/dashboard-page-data";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  let data;

  try {
    data = await getProjectById(params.id);
  } catch {
    notFound();
  }

  const { user, users } = await getDashboardPageData();
  const { project, tasks, summary } = data;
  const canManage = user.role === "Admin" || user.role === "Manager";
  const canDelete = user.role === "Admin" || project.createdBy?._id === user.id;

  return (
    <div className="space-y-6 pb-8">
      <DashboardPageHeader
        eyebrow="Project Detail"
        title={project.title}
        description={project.description}
        actions={<Link href="/dashboard/projects" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">Back to Projects</Link>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total Tasks", value: summary.totalTasks },
          { label: "Todo", value: summary.todo },
          { label: "In Progress", value: summary.inProgress },
          { label: "Completed", value: summary.completed },
          { label: "Overdue", value: summary.overdue }
        ].map((item) => (
          <div key={item.label} className="glass-panel mesh-card rounded-[1.8rem] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-teal dark:text-teal/90">{item.label}</p>
            <p className="mt-4 font-display text-4xl text-ink dark:text-slate-100">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <Card title="Project Overview" eyebrow="Metadata" className="animate-rise-delay-1">
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-950/35">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Created By</p>
                <p className="mt-2 font-semibold text-ink dark:text-slate-100">{project.createdBy?.name || "Unknown"}</p>
                <p className="mt-1">{project.createdBy?.email || "No email"}</p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-950/35">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Team Members</p>
                <div className="mt-3 space-y-3">
                  {project.members.length > 0 ? project.members.map((member: any) => (
                    <div key={member._id} className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60">
                      <p className="font-medium text-ink dark:text-slate-100">{member.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{member.role}</p>
                      <p className="mt-1 text-sm">{member.email}</p>
                    </div>
                  )) : <p>No members found.</p>}
                </div>
              </div>
            </div>
          </Card>

          {canManage ? (
            <Card title="Edit Project" eyebrow="Management" className="animate-rise-delay-2">
              <ProjectDetailActions project={project} users={users} canDelete={canDelete} taskCount={summary.totalTasks} />
            </Card>
          ) : null}

          {canManage ? (
            <Card title="Create Task In This Project" eyebrow="Planning" className="animate-rise-delay-2">
              <CreateTaskForm
                projects={[{ _id: project._id, title: project.title }]}
                users={users.map((member) => ({ _id: member._id, name: member.name }))}
                defaultProjectId={project._id}
                hideProjectSelect
                submitLabel="Create Task In Project"
              />
            </Card>
          ) : null}
        </div>

        <Card title="Project Tasks" eyebrow="Execution" className="animate-rise-delay-2">
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task: any) => (
              <div key={task._id} className="rounded-[1.5rem] border border-slate-200/80 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-950/35">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-ink dark:text-slate-100">{task.title}</p>
                    <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-coral/10 px-3 py-1 text-coral">{task.priority}</span>
                      <span className="rounded-full bg-ink/5 px-3 py-1 uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{task.status}</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 sm:text-right">
                    <p>Assigned: {task.assignedTo?.name || "Unknown"}</p>
                    <p className="mt-1">Due: {new Date(task.deadline).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500 dark:text-slate-400">No tasks are attached to this project yet.</p>}
          </div>
        </Card>
      </section>
    </div>
  );
}
