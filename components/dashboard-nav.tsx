"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/profile", label: "Profile" }
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-panel mesh-card animate-rise rounded-[2rem] p-4 lg:sticky lg:top-6">
      <p className="px-3 text-xs uppercase tracking-[0.32em] text-teal dark:text-teal/90">Workspace</p>
      <div className="mt-4 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-ink text-white shadow-soft dark:bg-slate-100 dark:text-slate-950"
                  : "bg-white/60 text-slate-600 hover:bg-white hover:text-ink dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              <span>{item.label}</span>
              <span className={clsx("h-2.5 w-2.5 rounded-full", active ? "bg-coral" : "bg-slate-300 dark:bg-slate-600")} />
            </Link>
          );
        })}
      </div>
      <div className="mt-5 border-t border-slate-200/80 pt-4 dark:border-slate-700/80">
        <LogoutButton className="w-full rounded-2xl px-4 py-3 text-sm" />
      </div>
    </nav>
  );
}
