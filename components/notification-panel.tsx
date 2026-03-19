"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "@/hooks/use-socket";
import { api } from "@/lib/api/client";

function NotificationTime({ createdAt }: { createdAt: string }) {
  const [formatted, setFormatted] = useState(createdAt);

  useEffect(() => {
    setFormatted(new Date(createdAt).toLocaleString());
  }, [createdAt]);

  return <p className="mt-1 text-xs text-slate-500">{formatted}</p>;
}

export function NotificationPanel({
  userId,
  notifications
}: {
  userId: string;
  notifications: Array<{ _id: string; message: string; read: boolean; createdAt: string }>;
}) {
  useSocket(userId, (payload) => {
    toast.success(payload.message || "New notification received");
  });

  async function markRead(id: string) {
    await api.patch(`/notifications/${id}`);
    window.location.reload();
  }

  return (
    <div className="space-y-3">
      {notifications.length === 0 ? <p className="text-sm text-slate-500">No notifications yet.</p> : null}
      {notifications.map((notification) => (
        <div key={notification._id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">{notification.message}</p>
              <NotificationTime createdAt={notification.createdAt} />
            </div>
            {!notification.read ? (
              <button onClick={() => markRead(notification._id)} className="rounded-full bg-ink px-3 py-1 text-xs text-white">
                Mark read
              </button>
            ) : (
              <span className="text-xs text-teal">Read</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
