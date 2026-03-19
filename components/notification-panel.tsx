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

  return <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatted}</p>;
}

function notificationTone(type: string) {
  if (type === "assignment") {
    return "border-l-teal";
  }

  if (type === "status_change") {
    return "border-l-coral";
  }

  if (type === "deadline") {
    return "border-l-gold";
  }

  return "border-l-slate-300 dark:border-l-slate-600";
}

function notificationBadge(type: string) {
  if (type === "assignment") {
    return "Assigned";
  }

  if (type === "status_change") {
    return "Status";
  }

  if (type === "deadline") {
    return "Deadline";
  }

  if (type === "project_update") {
    return "Update";
  }

  return "Info";
}

export function NotificationPanel({
  userId,
  notifications
}: {
  userId: string;
  notifications: Array<{ _id: string; type?: string; title?: string; details?: string; message: string; read: boolean; createdAt: string }>;
}) {
  useSocket(userId, (payload) => {
    toast.success(payload.title || payload.message || "New notification received");
  });

  async function markRead(id: string) {
    await api.patch(`/notifications/${id}`);
    window.location.reload();
  }

  return (
    <div className="space-y-3">
      {notifications.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p> : null}
      {notifications.map((notification) => (
        <div key={notification._id} className={`rounded-2xl border border-slate-200 bg-white/40 p-4 border-l-4 dark:border-slate-700 dark:bg-slate-950/35 ${notificationTone(notification.type || "system")}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {notificationBadge(notification.type || "system")}
                </span>
                {notification.read ? <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal dark:text-teal/90">Read</span> : null}
              </div>
              <p className="mt-3 break-words text-sm font-semibold text-ink dark:text-slate-100">
                {notification.title || notification.message}
              </p>
              {notification.details ? (
                <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">{notification.details}</p>
              ) : null}
              {!notification.details ? (
                <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">{notification.message}</p>
              ) : null}
              <NotificationTime createdAt={notification.createdAt} />
            </div>
            {!notification.read ? (
              <button onClick={() => markRead(notification._id)} className="rounded-full bg-ink px-3 py-1 text-xs text-white dark:bg-slate-100 dark:text-slate-950">
                Mark read
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
