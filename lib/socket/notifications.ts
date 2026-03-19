import { Notification } from "@/models/Notification";

declare global {
  var io:
    | {
        to(room: string): {
          emit(event: string, payload: unknown): void;
        };
      }
    | undefined;
}

export async function createNotification({
  userId,
  type = "system",
  title,
  details,
  message,
  relatedTask
}: {
  userId: string;
  type?: "assignment" | "status_change" | "deadline" | "project_update" | "system";
  title?: string;
  details?: string;
  message: string;
  relatedTask?: string;
}) {
  const notification = await Notification.create({
    user: userId,
    type,
    title: title || "Notification",
    details: details || "",
    message,
    relatedTask: relatedTask || null
  });

  global.io?.to(`user:${userId}`).emit("notification:new", notification);
  return notification;
}
