import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SceneIllustration } from "@/components/scene-illustration";

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-10">
      <section className="animate-rise-delay-1 order-2 space-y-5 lg:order-1">
        <div className="glass-panel mesh-card rounded-[2rem] p-6 sm:p-8 lg:p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-teal">Join Project Xeno</p>
          <h2 className="mt-3 font-display text-3xl text-ink dark:text-slate-100 sm:text-4xl">Create your Project Xeno account</h2>
          <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Provision a new account and step into a project management system built for planning, coordination, and execution visibility.
          </p>
          <div className="mt-6">
            <AuthForm mode="register" />
          </div>
        </div>
        <p className="px-1 text-sm text-slate-500 dark:text-slate-400 sm:px-2">
          Already onboarded? <Link href="/login" className="font-semibold text-coral">Sign in</Link>
        </p>
      </section>

      <section className="animate-rise relative order-1 overflow-hidden rounded-[2rem] bg-[#101626] px-6 py-8 text-white shadow-soft sm:rounded-[2.4rem] sm:px-8 sm:py-10 lg:order-2 lg:px-10 lg:py-12">
        <div className="hero-orb animate-float-delayed left-[-50px] top-10 h-36 w-36 bg-gold/35" />
        <div className="hero-orb animate-pulse-glow right-[-40px] top-[-30px] h-44 w-44 bg-coral/35" />
        <div className="relative z-10 min-w-0">
          <p className="text-xs uppercase tracking-[0.32em] text-teal/90 sm:text-sm sm:tracking-[0.42em]">Project Xeno</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-7xl">
            Build a team space that looks alive the moment work starts moving.
          </h1>
          <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:text-base sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
              Admins, managers, and members each get clear lanes and a shared source of truth.
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
              Notifications, analytics, and deadlines stay visible without turning the dashboard into noise.
            </div>
          </div>
          <div className="mt-8 min-w-0 overflow-hidden rounded-[1.8rem]">
            <SceneIllustration variant="auth" />
          </div>
        </div>
      </section>
    </main>
  );
}
