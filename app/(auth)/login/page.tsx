import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <section className="animate-rise w-full">
        <div className="glass-panel mesh-card rounded-[2rem] p-6 sm:rounded-[2.4rem] sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-teal">Project Xeno Access</p>
          <h1 className="mt-3 font-display text-3xl text-ink dark:text-slate-100 sm:text-4xl">Sign in to Project Xeno</h1>
          <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Managers orchestrate delivery, admins shape governance, and members move work with clarity.
          </p>
          <div className="mt-6 sm:mt-8">
            <AuthForm mode="login" />
          </div>
          <p className="mt-6 px-1 text-sm text-slate-500 dark:text-slate-400 sm:px-2">
            Need an account? <Link href="/register" className="font-semibold text-coral">Create one here</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
