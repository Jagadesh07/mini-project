import { Card } from "@/components/card";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { NotificationPanel } from "@/components/notification-panel";
import { getDashboardPageData } from "@/lib/dashboard-page-data";

export default async function NotificationsPage() {
  const { user, notifications } = await getDashboardPageData();

  return (
    <div className="space-y-6 pb-8">
      <DashboardPageHeader
        eyebrow="Realtime"
        title="Notifications"
        description="Review assignment alerts, status changes, and deadline reminders in one focused feed."
      />

      <Card title="All Notifications" eyebrow="Inbox" className="animate-rise-delay-1">
        <NotificationPanel userId={user.id} notifications={notifications} />
      </Card>
    </div>
  );
}
