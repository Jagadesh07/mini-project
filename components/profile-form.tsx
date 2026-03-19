"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";
import { useAuth } from "@/hooks/use-auth";

interface ProfileFormProps {
  profile: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
    jobTitle?: string | null;
    bio?: string | null;
    phone?: string | null;
    location?: string | null;
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl || "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      await api.patch("/auth/me", {
        name: formData.get("name"),
        avatarUrl: formData.get("avatarUrl"),
        jobTitle: formData.get("jobTitle"),
        bio: formData.get("bio"),
        phone: formData.get("phone"),
        location: formData.get("location")
      });
      await refreshUser();
      router.refresh();
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not update profile");
    } finally {
      setLoading(false);
    }
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <form action={async (formData) => handleSubmit(formData)} className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-4 rounded-[1.8rem] border border-slate-200/80 bg-white/70 p-5 backdrop-blur dark:border-slate-700 dark:bg-slate-950/45">
        <div className="overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#101626] via-[#0f8b8d] to-[#ff6b4a] p-[1px]">
          <div className="flex h-56 items-center justify-center rounded-[1.5rem] bg-slate-950/90 sm:h-64">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 font-display text-3xl text-white sm:h-28 sm:w-28 sm:text-4xl">
                {initials}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Profile picture URL</label>
          <input
            name="avatarUrl"
            defaultValue={profile.avatarUrl || ""}
            onChange={(event) => setAvatarPreview(event.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
          />
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
          Use any public image URL for now. This keeps profile photo updates simple without needing a storage service.
        </div>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
          <input name="name" defaultValue={profile.name} className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Job title</label>
          <input name="jobTitle" defaultValue={profile.jobTitle || ""} placeholder="Product Manager" className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
          <input value={profile.email} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Role</label>
          <input value={profile.role} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
          <input name="phone" defaultValue={profile.phone || ""} placeholder="+91 98765 43210" className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Location</label>
          <input name="location" defaultValue={profile.location || ""} placeholder="Chennai, India" className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Bio</label>
          <textarea name="bio" defaultValue={profile.bio || ""} placeholder="Tell the team what you own and how you work best." className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700" />
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="w-full rounded-2xl bg-ink px-5 py-3 font-medium text-white hover:bg-coral disabled:opacity-60 sm:w-auto">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}
