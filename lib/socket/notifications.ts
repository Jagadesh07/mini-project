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
  message,
  relatedTask
}: {
  userId: string;
  message: string;
  relatedTask?: string;
}) {
  const notification = await Notification.create({
    user: userId,
    message,
    relatedTask: relatedTask || null
  });

  global.io?.to(`user:${userId}`).emit("notification:new", notification);
  return notification;
}
