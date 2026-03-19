"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const COLORS = ["#0f8b8d", "#ff6b4a", "#f2c14e", "#101626"];

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }> }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-white/95 px-4 py-3 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color || "#0f8b8d" }} />
        <p className="text-sm font-semibold text-ink dark:text-slate-100">{item.name}</p>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Tasks: <span className="font-semibold text-ink dark:text-slate-100">{item.value}</span></p>
    </div>
  );
}

export function StatsChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const chartData = data.length > 0 ? data : [{ name: "No projects yet", value: 0 }];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const pieData = total > 0 ? chartData.filter((item) => item.value > 0) : [{ name: "No tasks yet", value: 1 }];

  return (
    <div className="min-w-0 space-y-6 overflow-hidden">
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] xl:items-center">
        <div className="min-w-0 rounded-[1.8rem] border border-slate-200/80 bg-white/70 p-5 shadow-soft dark:border-slate-700 dark:bg-slate-950/45">
          <div className="relative h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={92}
                  innerRadius={58}
                  minAngle={total > 0 && pieData.length > 1 ? 8 : 0}
                  paddingAngle={total > 0 && pieData.length > 1 ? 3 : 0}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={total > 0 ? COLORS[index % COLORS.length] : "#cbd5e1"} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Total Tasks</p>
                <p className="mt-2 font-display text-4xl text-ink dark:text-slate-100">{total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-[1.6rem] border border-slate-200/80 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35">
            <p className="text-xs uppercase tracking-[0.28em] text-teal">Project workload</p>
            <h4 className="mt-3 font-display text-3xl text-ink dark:text-slate-100">{total}</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Total tracked tasks distributed across your active projects.</p>
          </div>

          <div className="space-y-3">
            {chartData.map((item, index) => {
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              const color = COLORS[index % COLORS.length];

              return (
                <div key={item.name} className="rounded-[1.5rem] border border-slate-200/80 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-950/35">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{item.name}</p>
                        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{percentage}% of all tracked tasks</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-white/70 p-5 shadow-soft dark:border-slate-700 dark:bg-slate-950/45">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.28em] text-teal">Project breakdown</p>
            <h4 className="mt-2 font-display text-2xl text-ink dark:text-slate-100">Tasks in each project</h4>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Each bar shows how many tasks belong to a project.</p>
        </div>
        <div className="h-80 w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 12, left: -16, bottom: 8 }} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(15, 139, 141, 0.08)" }} />
              <Bar dataKey="value" radius={[14, 14, 4, 4]} maxBarSize={72}>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
