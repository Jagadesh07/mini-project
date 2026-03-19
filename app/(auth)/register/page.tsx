import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center gap-10 px-6 py-16 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <section>
        <AuthForm mode="register" />
        <p className="mt-4 text-sm text-slate-500">
          Already onboarded? <Link href="/login" className="font-semibold text-coral">Sign in</Link>
        </p>
      </section>
      <section>
        <p className="text-sm uppercase tracking-[0.4em] text-teal">Delivery Engine</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-ink">Build accountable teams with clear ownership and live execution signals.</h1>
        <div className="mt-6 space-y-4 text-slate-600">
          <p>Admins oversee the full workspace, managers coordinate delivery, and members stay focused on assigned work.</p>
          <p>Notifications, deadline awareness, filtered tasks and analytics keep everyone aligned without context switching.</p>
        </div>
      </section>
    </main>
  );
}
