"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export function CreateProjectForm({
  users
}: {
  users: Array<{ _id: string; name: string; email: string; role: string }>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const members = formData.getAll("members").map(String).filter(Boolean);

    try {
      await api.post("/projects", {
        title: formData.get("title"),
        description: formData.get("description"),
        members
      });
      toast.success("Project created");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={async (formData) => handleSubmit(formData)} className="min-w-0 space-y-3">
      <input name="title" placeholder="Website Redesign" className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" required />
      <textarea name="description" placeholder="Outline the business and delivery goals" className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" required />
      <div className="space-y-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Add project members</p>
        <select name="members" multiple className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700">
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role}) - {user.email}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 dark:text-slate-400">Hold Ctrl or Cmd to select multiple members.</p>
      </div>
      <button disabled={loading} className="w-full rounded-2xl bg-teal px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto">
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
