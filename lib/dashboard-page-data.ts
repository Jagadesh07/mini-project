import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/controllers/dashboard-controller";
import { Notification } from "@/models/Notification";
import { User } from "@/models/User";

export async function getDashboardPageData() {
  const token = cookies().get("stm_access")?.value;
  if (!token) {
    redirect("/login");
  }

  const user = verifyAccessToken(token);
  await connectToDatabase();

  const [dashboard, notifications, users, currentUserDoc] = await Promise.all([
    getDashboardMetrics(),
    Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(30).lean(),
    User.find({}, "name email role").sort({ createdAt: -1 }).lean(),
    User.findById(user.id).lean()
  ]);

  if (!currentUserDoc) {
    redirect("/login");
  }

  return {
    user,
    currentUser: {
      id: String(currentUserDoc._id),
      email: currentUserDoc.email,
      role: currentUserDoc.role,
      name: currentUserDoc.name,
      avatarUrl: currentUserDoc.avatarUrl || null,
      jobTitle: currentUserDoc.jobTitle || "",
      bio: currentUserDoc.bio || "",
      phone: currentUserDoc.phone || "",
      location: currentUserDoc.location || ""
    },
    dashboard,
    notifications: notifications.map((item: any) => ({
      ...item,
      _id: String(item._id),
      type: item.type || "system",
      title: item.title || item.message || "Notification",
      details: item.details || "",
      createdAt: new Date(item.createdAt).toISOString()
    })),
    users: users.map((member: any) => ({
      _id: String(member._id),
      name: member.name,
      email: member.email,
      role: member.role
    }))
  };
}
