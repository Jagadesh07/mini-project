"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export function CreateTaskForm({
  projects,
  users
}: {
  projects: Array<{ _id: string; title: string }>;
  users: Array<{ _id: string; name: string }>;
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
    <form action={async (formData) => handleSubmit(formData)} className="grid gap-3 md:grid-cols-2">
      <input name="title" placeholder="QA regression sweep" className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" required />
      <textarea name="description" placeholder="What success looks like" className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" required />
      <select name="project" className="rounded-2xl border border-slate-200 px-4 py-3" required>
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>{project.title}</option>
        ))}
      </select>
      <select name="assignedTo" className="rounded-2xl border border-slate-200 px-4 py-3" required>
        <option value="">Assign to</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <select name="status" className="rounded-2xl border border-slate-200 px-4 py-3">
        <option>Todo</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <select name="priority" className="rounded-2xl border border-slate-200 px-4 py-3">
        <option>Low</option>
        <option selected>Medium</option>
        <option>High</option>
      </select>
      <input name="deadline" type="datetime-local" className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" required />
      <button disabled={loading} className="rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 md:col-span-2">
        {loading ? "Saving..." : "Create Task"}
      </button>
    </form>
  );
}
