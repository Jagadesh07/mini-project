import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center gap-10 px-6 py-16 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <p className="text-sm uppercase tracking-[0.4em] text-teal">Smart Ops</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-ink">Run projects, tasks and notifications from one operational cockpit.</h1>
        <p className="mt-6 max-w-xl text-lg text-slate-600">
          JWT auth, RBAC, MongoDB-backed projects, real-time task notifications and an opinionated dashboard are all wired into this starter.
        </p>
      </section>
      <section>
        <AuthForm mode="login" />
        <p className="mt-4 text-sm text-slate-500">
          Need an account? <Link href="/register" className="font-semibold text-coral">Create one here</Link>
        </p>
      </section>
    </main>
  );
}
