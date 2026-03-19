import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardNav } from "@/components/dashboard-nav";
import { NotificationPanel } from "@/components/notification-panel";
import { connectToDatabase } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth";
import { Notification } from "@/models/Notification";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("stm_access")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = verifyAccessToken(token);
  await connectToDatabase();

  const notifications = await Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(8).lean();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
          <DashboardNav />
          <section className="glass-panel mesh-card animate-rise-delay-2 rounded-[2rem] p-4">
            <p className="px-3 text-xs uppercase tracking-[0.32em] text-teal dark:text-teal/90">Realtime</p>
            <h2 className="px-3 pt-3 font-display text-xl text-ink dark:text-slate-100 sm:text-2xl">Latest Notifications</h2>
            <div className="mt-4 min-h-[280px] px-1 sm:min-h-[360px] lg:min-h-[420px]">
              <div className="max-h-[360px] overflow-y-auto pr-2 sm:max-h-[440px] lg:max-h-[540px]">
                <NotificationPanel
                  userId={user.id}
                  notifications={notifications.map((item: any) => ({
                    ...item,
                    _id: String(item._id),
                    createdAt: new Date(item.createdAt).toISOString()
                  }))}
                />
              </div>
            </div>
          </section>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
