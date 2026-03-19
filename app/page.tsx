import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SceneIllustration } from "@/components/scene-illustration";

export default function HomePage() {
  const isAuthenticated = !!cookies().get("stm_access")?.value;

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <section className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="animate-rise glass-panel mesh-card rounded-[2rem] p-6 sm:rounded-[2.4rem] sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-teal sm:text-sm sm:tracking-[0.42em]">Project Xeno</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink dark:text-slate-100 sm:text-5xl lg:text-6xl">
            Turn work chaos into a clear workflow.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            See the workflow preview, then jump straight into your account when you are ready to manage projects, tasks, and updates.
          </p>
          <div className="mt-6 sm:mt-8">
            <Link href="/login" className="inline-flex w-full justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-coral sm:w-auto">
              Login
            </Link>
          </div>
        </div>

        <div className="animate-rise-delay-2 min-w-0 overflow-hidden rounded-[2rem] sm:rounded-[2.4rem]">
          <SceneIllustration variant="auth" />
        </div>
      </section>
    </main>
  );
}
