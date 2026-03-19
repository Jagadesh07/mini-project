"use client";

import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export function GlobalUserBar() {
  const { user, loading } = useAuth();
  const { theme, mounted, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="h-11 w-full max-w-[15rem] rounded-full border border-white/60 bg-white/60 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/70" />
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="h-11 w-full sm:w-24 rounded-full border border-white/60 bg-white/60 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/70" />
          <div className="h-11 w-full sm:w-40 rounded-full border border-white/60 bg-white/60 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="glass-panel mesh-card flex min-w-0 items-center gap-3 rounded-full px-3 py-2">
        <div className="overflow-hidden rounded-full bg-white dark:bg-slate-950">
          <Image src="/pxlogo.jpg" alt="Project Xeno logo" width={40} height={40} className="h-10 w-10 object-cover" priority />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">Project Xeno</p>
          <p className="truncate text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Project Management</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          className="glass-panel mesh-card rounded-full px-4 py-2 text-sm font-medium text-ink dark:text-slate-100"
          aria-label="Toggle dark mode"
        >
          {mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : "Theme"}
        </button>

        {user ? (
          <div className="glass-panel mesh-card flex min-w-0 items-center gap-3 rounded-full px-3 py-2">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="min-w-0 pr-2">
              <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{user.name}</p>
              <p className="truncate text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{user.role}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
