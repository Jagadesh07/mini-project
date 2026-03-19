"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export function CreateTaskForm({
  projects,
  users,
  defaultProjectId,
  hideProjectSelect = false,
  submitLabel = "Create Task"
}: {
  projects: Array<{ _id: string; title: string }>;
  users: Array<{ _id: string; name: string }>;
  defaultProjectId?: string;
  hideProjectSelect?: boolean;
  submitLabel?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      await api.post("/tasks", {
        title: formData.get("title"),
        description: formData.get("description"),
        project: formData.get("project"),
        assignedTo: formData.get("assignedTo"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        deadline: new Date(String(formData.get("deadline"))).toISOString()
      });
      toast.success("Task created");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={async (formData) => handleSubmit(formData)} className="grid min-w-0 gap-3 md:grid-cols-2">
      <input name="title" placeholder="QA regression sweep" className="w-full rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2 dark:border-slate-700" required />
      <textarea name="description" placeholder="What success looks like" className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2 dark:border-slate-700" required />
      {hideProjectSelect ? (
        <input type="hidden" name="project" value={defaultProjectId || ""} />
      ) : (
        <select name="project" defaultValue={defaultProjectId || ""} className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" required>
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>{project.title}</option>
          ))}
        </select>
      )}
      <select name="assignedTo" className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" required>
        <option value="">Assign to</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <select name="status" className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
        <option>Todo</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <select name="priority" className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" defaultValue="Medium">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input name="deadline" type="datetime-local" className="w-full rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2 dark:border-slate-700" required />
      <button disabled={loading} className="w-full rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 md:col-span-2 sm:w-auto">
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
