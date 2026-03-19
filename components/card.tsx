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
    <section className={clsx("rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur", className)}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-teal">{eyebrow}</p> : null}
      <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
