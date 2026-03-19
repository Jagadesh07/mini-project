import { Card } from "@/components/card";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { SceneIllustration } from "@/components/scene-illustration";
import { StatsChart } from "@/components/stats-chart";
import { getDashboardPageData } from "@/lib/dashboard-page-data";

const summaryStyles = [
  "from-[#101626] to-[#182742] text-white",
  "from-[#0f8b8d] to-[#125b64] text-white",
  "from-[#ff6b4a] to-[#d94e2f] text-white",
  "from-[#f2c14e] to-[#d7a63a] text-ink"
];

export default async function DashboardPage() {
  const { user, dashboard } = await getDashboardPageData();

  const summaryCards = [
    { label: "Tasks", value: dashboard.summary.totalTasks, help: "Tracked across your workspace" },
    { label: "Projects", value: dashboard.summary.totalProjects, help: "Active delivery lanes" },
    { label: "Completion", value: `${dashboard.summary.completionRate}%`, help: "Work finished on time" },
    { label: "Overdue", value: dashboard.summary.overdueTasks, help: "Needs attention today" }
  ];

  return (
    <div className="space-y-6 pb-8">
      <DashboardPageHeader
        eyebrow="Overview"
        title={`Welcome back, ${user.name}`}
        description="Scan workspace health, review live updates, and jump into the area that needs attention first."
        actions={<span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">Role: {user.role}</span>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item, index) => (
          <div key={item.label} className="animate-rise-delay-1 rounded-[1.8rem] bg-gradient-to-br p-[1px]">
            <div className={`h-full rounded-[1.75rem] bg-gradient-to-br ${summaryStyles[index]} p-5 shadow-soft`}>
              <p className="text-xs uppercase tracking-[0.32em] opacity-80">{item.label}</p>
              <p className="mt-4 font-display text-4xl">{item.value}</p>
              <p className="mt-2 text-sm opacity-85">{item.help}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6">
        <Card title="Delivery Signal" eyebrow="Snapshot" className="animate-rise-delay-1">
          <SceneIllustration variant="dashboard" />
        </Card>
        <Card title="Tasks by Project" eyebrow="Analytics" className="animate-rise-delay-2">
          <StatsChart data={dashboard.taskStats} />
        </Card>
      </section>
    </div>
  );
}
