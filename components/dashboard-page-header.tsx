import { ReactNode } from "react";

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="animate-rise relative overflow-hidden rounded-[1.8rem] bg-[#0f172a] px-5 py-6 text-white shadow-soft sm:rounded-[2.2rem] sm:px-7 sm:py-7 lg:px-8 lg:py-8">
      <div className="hero-orb animate-pulse-glow left-[-50px] top-[-30px] h-36 w-36 bg-coral/35" />
      <div className="hero-orb animate-float-delayed right-8 top-6 h-24 w-24 bg-teal/30" />
      <div className="relative z-10 flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.28em] text-gold sm:text-sm sm:tracking-[0.38em]">{eyebrow}</p>
          <h1 className="mt-3 break-words font-display text-3xl sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
