import Link from "next/link";
import { Card } from "@/components/card";
import { CreateProjectForm } from "@/components/create-project-form";
import { CreateTaskForm } from "@/components/create-task-form";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { getDashboardPageData } from "@/lib/dashboard-page-data";

export default async function ProjectsPage() {
  const { user, dashboard, users } = await getDashboardPageData();

  return (
    <div className="space-y-6 pb-8">
      <DashboardPageHeader
        eyebrow="Planning"
        title="Projects"
        description="Create new project lanes, manage members, and review active portfolio coverage."
      />

      {(user.role === "Admin" || user.role === "Manager") ? (
        <section className="grid gap-6 xl:grid-cols-2">
          <Card title="Create Project" eyebrow="Managers" className="animate-rise-delay-1 min-w-0">
            <CreateProjectForm users={users} />
          </Card>
          <Card title="Create Task" eyebrow="Planning" className="animate-rise-delay-2 min-w-0">
            <CreateTaskForm
              projects={dashboard.projects.map((project: any) => ({ _id: String(project._id), title: project.title }))}
              users={users.map((member) => ({ _id: member._id, name: member.name }))}
            />
          </Card>
        </section>
      ) : null}

      <Card title="Project Portfolio" eyebrow="Scope" className="animate-rise-delay-2">
        <div className="grid gap-4 md:grid-cols-2">
          {dashboard.projects.map((project: any, index: number) => (
            <Link key={String(project._id)} href={`/dashboard/projects/${String(project._id)}`} className="group block">
              <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white/75 p-5 backdrop-blur transition group-hover:-translate-y-1 group-hover:border-coral/50 dark:border-slate-700 dark:bg-slate-950/45">
                <div className={`hero-orb ${index % 2 === 0 ? "animate-float-slow bg-coral/10" : "animate-float-delayed bg-teal/10"} right-[-20px] top-[-10px] h-20 w-20`} />
                <div className="relative z-10 min-w-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-ink dark:text-slate-100">{project.title}</p>
                      <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                      <p className="mt-3 text-sm font-medium text-teal dark:text-teal/90">Open project details</p>
                    </div>
                    <span className="w-fit rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-ink dark:text-slate-100">Active</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {dashboard.projects.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">No projects created yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}
