"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export function ProjectDetailActions({
  project,
  users,
  canDelete,
  taskCount
}: {
  project: {
    _id: string;
    title: string;
    description: string;
    members: Array<{ _id: string }>;
  };
  users: Array<{ _id: string; name: string; email: string; role: string }>;
  canDelete: boolean;
  taskCount: number;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleUpdate(formData: FormData) {
    setSaving(true);
    const members = formData.getAll("members").map(String).filter(Boolean);

    try {
      await api.patch(`/projects/${project._id}`, {
        title: formData.get("title"),
        description: formData.get("description"),
        members
      });
      toast.success("Project updated");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not update project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);

    try {
      await api.delete(`/projects/${project._id}`);
      toast.success("Project deleted");
      router.push("/dashboard/projects");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not delete project");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <form action={async (formData) => handleUpdate(formData)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Project title</label>
          <input name="title" defaultValue={project.title} className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
          <textarea name="description" defaultValue={project.description} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" required />
        </div>
        <div className="space-y-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Project members</p>
          <select
            name="members"
            multiple
            defaultValue={project.members.map((member) => member._id)}
            className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700"
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role}) - {user.email}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400">Hold Ctrl or Cmd to select multiple members.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button disabled={saving} className="w-full rounded-2xl bg-teal px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto">
            {saving ? "Saving..." : "Save Project Changes"}
          </button>
          {canDelete ? (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="w-full rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </button>
          ) : null}
        </div>
      </form>

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="glass-panel mesh-card w-full max-w-md rounded-[2rem] p-6 shadow-soft dark:border-slate-700 dark:bg-slate-950/90">
            <p className="text-xs uppercase tracking-[0.28em] text-coral">Confirm Delete</p>
            <h3 className="mt-3 font-display text-3xl text-ink dark:text-slate-100">Delete this project?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              This will remove <span className="font-semibold text-ink dark:text-slate-100">{project.title}</span> from the active workspace.
            </p>
            {taskCount > 0 ? (
              <div className="mt-4 rounded-[1.4rem] border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
                Warning: this project currently has <span className="font-semibold">{taskCount}</span> task{taskCount === 1 ? "" : "s"}. Deleting the project will hide the project, but those tasks will still remain in the database unless you handle them separately.
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                This project does not currently have any tasks attached.
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
              >
                {deleting ? "Deleting..." : "Yes, Delete Project"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
