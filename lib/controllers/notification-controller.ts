import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import { Notification } from "@/models/Notification";
import { AppError } from "@/utils/errors";

export async function listNotifications() {
  await connectToDatabase();
  const user = requireAuth();
  return Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(25);
}

export async function markNotificationRead(id: string) {
  await connectToDatabase();
  const user = requireAuth();
  const notification = await Notification.findOne({ _id: id, user: user.id });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  notification.read = true;
  await notification.save();
  return notification;
}
