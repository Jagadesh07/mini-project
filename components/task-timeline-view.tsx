"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

interface TimelineTask {
  _id: string;
  title: string;
  status: string;
  priority: string;
  deadline: string;
  project?: { title?: string | null } | null;
  assignedTo?: { name?: string | null } | null;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date);
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short"
  }).format(date);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatFullDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(date);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(left: Date, right: Date) {
  return startOfDay(left).getTime() === startOfDay(right).getTime();
}

function statusTone(status: string) {
  if (status === "Completed") {
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
  }

  if (status === "In Progress") {
    return "bg-teal/15 text-teal dark:text-teal/90";
  }

  return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
}

function priorityTone(priority: string) {
  if (priority === "High") {
    return "bg-coral/15 text-coral";
  }

  if (priority === "Medium") {
    return "bg-gold/20 text-ink dark:text-slate-100";
  }

  return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function laneConfig(lane: "overdue" | "today" | "upcoming") {
  if (lane === "overdue") {
    return {
      title: "Overdue",
      description: "Tasks whose deadline has already passed.",
      dot: "bg-coral",
      border: "before:bg-coral/40",
      chip: "bg-coral/10 text-coral"
    };
  }

  if (lane === "today") {
    return {
      title: "Today",
      description: "Tasks due today and ready for action.",
      dot: "bg-gold",
      border: "before:bg-gold/40",
      chip: "bg-gold/20 text-ink dark:text-slate-100"
    };
  }

  return {
    title: "Upcoming",
    description: "Future deadlines lined up chronologically.",
    dot: "bg-teal",
    border: "before:bg-teal/40",
    chip: "bg-teal/15 text-teal dark:text-teal/90"
  };
}

export function TaskTimelineView({ tasks }: { tasks: TimelineTask[] }) {
  const router = useRouter();
  const [localTasks, setLocalTasks] = useState(tasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [droppingDayKey, setDroppingDayKey] = useState<string | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = startOfDay(new Date());

  const calendarDays = useMemo(
    () => Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const dayTasks = localTasks.filter((task) => isSameDay(new Date(task.deadline), date));

      return {
        key: date.toISOString(),
        date,
        tasks: dayTasks
      };
    }),
    [localTasks, today]
  );

  const monthGridDays = useMemo(() => {
    const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - monthStart.getDay());
    const gridEnd = new Date(monthEnd);
    gridEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

    const days = [] as Array<{ key: string; date: Date; tasks: TimelineTask[]; inMonth: boolean }>;
    const cursor = new Date(gridStart);

    while (cursor <= gridEnd) {
      const date = new Date(cursor);
      days.push({
        key: date.toISOString(),
        date,
        tasks: localTasks.filter((task) => isSameDay(new Date(task.deadline), date)),
        inMonth: date.getMonth() === visibleMonth.getMonth()
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }, [localTasks, visibleMonth]);

  const laneGroups = useMemo(() => {
    const groups = {
      overdue: [] as Array<{ date: string; label: string; items: TimelineTask[] }>,
      today: [] as Array<{ date: string; label: string; items: TimelineTask[] }>,
      upcoming: [] as Array<{ date: string; label: string; items: TimelineTask[] }>
    };

    localTasks
      .slice()
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .forEach((task) => {
        const deadline = new Date(task.deadline);
        const day = startOfDay(deadline);
        const lane = day.getTime() < today.getTime()
          ? "overdue"
          : day.getTime() === today.getTime()
            ? "today"
            : "upcoming";

        const target = groups[lane];
        const key = day.toISOString();
        const lastGroup = target[target.length - 1];

        if (!lastGroup || lastGroup.date !== key) {
          target.push({
            date: key,
            label: formatFullDateLabel(day),
            items: [task]
          });
        } else {
          lastGroup.items.push(task);
        }
      });

    return groups;
  }, [localTasks, today]);

  async function moveTaskToDay(taskId: string, nextDay: Date) {
    const task = localTasks.find((item) => item._id === taskId);
    if (!task) {
      return;
    }

    const currentDeadline = new Date(task.deadline);
    const updatedDeadline = new Date(nextDay);
    updatedDeadline.setHours(currentDeadline.getHours(), currentDeadline.getMinutes(), 0, 0);

    if (isSameDay(currentDeadline, updatedDeadline)) {
      return;
    }

    const nextDeadlineIso = updatedDeadline.toISOString();
    const previousTasks = localTasks;

    setLocalTasks((current) => current.map((item) => (
      item._id === taskId ? { ...item, deadline: nextDeadlineIso } : item
    )));

    try {
      await api.patch(`/tasks/${taskId}`, { deadline: nextDeadlineIso });
      toast.success(`Task moved to ${formatDateLabel(updatedDeadline)}`);
      router.refresh();
    } catch (error: any) {
      setLocalTasks(previousTasks);
      toast.error(error.response?.data?.error || "Could not reschedule task");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.8rem] border border-slate-200/80 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-teal">Monthly Calendar</p>
            <h3 className="mt-2 font-display text-2xl text-ink dark:text-slate-100">{formatMonthLabel(visibleMonth)}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A full monthly grid for deadline planning and quick drag-and-drop rescheduling.</p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-950"
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Next
            </button>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-7 gap-3">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  {label}
                </div>
              ))}
              {monthGridDays.map((day) => {
                const isTodayCard = isSameDay(day.date, today);
                const isDropTarget = droppingDayKey === day.key;

                return (
                  <div
                    key={day.key}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDroppingDayKey(day.key);
                    }}
                    onDragLeave={() => setDroppingDayKey((current) => (current === day.key ? null : current))}
                    onDrop={async (event) => {
                      event.preventDefault();
                      const taskId = event.dataTransfer.getData("text/task-id") || draggedTaskId;
                      setDroppingDayKey(null);
                      setDraggedTaskId(null);
                      if (taskId) {
                        await moveTaskToDay(taskId, day.date);
                      }
                    }}
                    className={`min-h-[150px] rounded-[1.4rem] border p-3 transition ${
                      isDropTarget
                        ? "border-teal bg-teal/10 dark:border-teal/80"
                        : isTodayCard
                          ? "border-coral/50 bg-coral/10"
                          : day.inMonth
                            ? "border-slate-200/80 bg-white/70 dark:border-slate-700 dark:bg-slate-900/60"
                            : "border-slate-200/60 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-950/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${day.inMonth ? "text-ink dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>
                        {day.date.getDate()}
                      </span>
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {day.tasks.length}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {day.tasks.length > 0 ? day.tasks.slice(0, 3).map((task) => (
                        <div
                          key={task._id}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/task-id", task._id);
                            setDraggedTaskId(task._id);
                          }}
                          onDragEnd={() => {
                            setDraggedTaskId(null);
                            setDroppingDayKey(null);
                          }}
                          className="cursor-grab rounded-xl bg-slate-100 px-2.5 py-2 text-xs text-slate-700 active:cursor-grabbing dark:bg-slate-800 dark:text-slate-200"
                        >
                          <p className="truncate font-medium">{task.title}</p>
                          <p className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">{task.project?.title || "No project"}</p>
                        </div>
                      )) : <p className="text-xs text-slate-400 dark:text-slate-500">Drop here</p>}
                      {day.tasks.length > 3 ? <p className="text-[11px] text-slate-500 dark:text-slate-400">+{day.tasks.length - 3} more</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[1.8rem] border border-slate-200/80 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-teal">Calendar View</p>
              <h3 className="mt-2 font-display text-2xl text-ink dark:text-slate-100">Next 14 days</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Drag tasks between days to reschedule deadlines.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {calendarDays.map((day) => {
              const isTodayCard = isSameDay(day.date, today);
              const isDropTarget = droppingDayKey === day.key;

              return (
                <div
                  key={day.key}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDroppingDayKey(day.key);
                  }}
                  onDragLeave={() => setDroppingDayKey((current) => (current === day.key ? null : current))}
                  onDrop={async (event) => {
                    event.preventDefault();
                    const taskId = event.dataTransfer.getData("text/task-id") || draggedTaskId;
                    setDroppingDayKey(null);
                    setDraggedTaskId(null);
                    if (taskId) {
                      await moveTaskToDay(taskId, day.date);
                    }
                  }}
                  className={`rounded-[1.4rem] border p-4 transition ${
                    isDropTarget
                      ? "border-teal bg-teal/10 dark:border-teal/80"
                      : isTodayCard
                        ? "border-coral/50 bg-coral/10"
                        : "border-slate-200/80 bg-white/70 dark:border-slate-700 dark:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{formatDayLabel(day.date)}</p>
                      <p className="mt-1 font-semibold text-ink dark:text-slate-100">{formatDateLabel(day.date)}</p>
                    </div>
                    <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {day.tasks.length} task{day.tasks.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {day.tasks.length > 0 ? day.tasks.slice(0, 3).map((task) => (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/task-id", task._id);
                          setDraggedTaskId(task._id);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDroppingDayKey(null);
                        }}
                        className="cursor-grab rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700 active:cursor-grabbing dark:bg-slate-800 dark:text-slate-200"
                      >
                        <p className="truncate font-medium">{task.title}</p>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{task.project?.title || "No project"}</p>
                      </div>
                    )) : <p className="text-sm text-slate-400 dark:text-slate-500">Drop a task here</p>}
                    {day.tasks.length > 3 ? <p className="text-xs text-slate-500 dark:text-slate-400">+{day.tasks.length - 3} more</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-200/80 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-teal">Timeline View</p>
              <h3 className="mt-2 font-display text-2xl text-ink dark:text-slate-100">Deadline lanes</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Overdue, today, and upcoming work separated visually.</p>
          </div>
          <div className="mt-5 space-y-8">
            {(["overdue", "today", "upcoming"] as const).map((lane) => {
              const config = laneConfig(lane);
              const groups = laneGroups[lane];

              return (
                <div key={lane} className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${config.chip}`}>
                        {config.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{config.description}</p>
                    </div>
                  </div>
                  {groups.length > 0 ? groups.map((group) => (
                    <div key={group.date} className={`relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-px ${config.border}`}>
                      <div className={`absolute left-0 top-2 h-4 w-4 rounded-full ${config.dot} ring-4 ring-white dark:ring-slate-950`} />
                      <p className="text-sm font-semibold text-ink dark:text-slate-100">{group.label}</p>
                      <div className="mt-3 space-y-3">
                        {group.items.map((task) => (
                          <div key={task._id} className="rounded-[1.4rem] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <p className="break-words font-semibold text-ink dark:text-slate-100">{task.title}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.project?.title || "No project"}</p>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                  <span className={`rounded-full px-3 py-1 ${statusTone(task.status)}`}>{task.status}</span>
                                  <span className={`rounded-full px-3 py-1 ${priorityTone(task.priority)}`}>{task.priority}</span>
                                </div>
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400 sm:text-right">
                                <p>{new Date(task.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                <p className="mt-1">{task.assignedTo?.name || "Unassigned"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500 dark:text-slate-400">No tasks in this lane.</p>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
