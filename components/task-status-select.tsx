"use client";

import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

const statuses = ["Todo", "In Progress", "Completed"];

export function TaskStatusSelect({
  taskId,
  currentStatus,
  disabled
}: {
  taskId: string;
  currentStatus: string;
  disabled?: boolean;
}) {
  async function updateStatus(nextStatus: string) {
    try {
      await api.patch(`/tasks/${taskId}`, { status: nextStatus });
      toast.success("Task status updated");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not update task");
    }
  }

  return (
    <select
      disabled={disabled}
      defaultValue={currentStatus}
      onChange={(event) => updateStatus(event.target.value)}
      className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs disabled:bg-slate-100 sm:w-auto dark:border-slate-700 dark:disabled:bg-slate-800"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}
