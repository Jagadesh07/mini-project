import { Card } from "@/components/card";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ProfileForm } from "@/components/profile-form";
import { getDashboardPageData } from "@/lib/dashboard-page-data";

export default async function ProfilePage() {
  const { currentUser } = await getDashboardPageData();

  return (
    <div className="space-y-6 pb-8">
      <DashboardPageHeader
        eyebrow="Identity"
        title="Profile"
        description="Update your profile picture, role context, and working details so the workspace feels more personal and informative."
      />

      <Card title="Your Details" eyebrow="Profile" className="animate-rise-delay-1">
        <ProfileForm profile={currentUser} />
      </Card>
    </div>
  );
}
