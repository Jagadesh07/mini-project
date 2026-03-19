"use client";

import clsx from "clsx";
import { ReactNode } from "react";

export function Card({
  title,
  eyebrow,
  children,
  className
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("glass-panel mesh-card animate-rise rounded-[2rem] p-6 lg:p-7", className)}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.32em] text-teal dark:text-teal/90">{eyebrow}</p> : null}
      <div className="mt-2 h-px w-24 shimmer-line rounded-full" />
      <h3 className="mt-4 font-display text-2xl text-ink dark:text-slate-100">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}
