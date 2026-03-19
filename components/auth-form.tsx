"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());

    try {
      const url = mode === "login" ? "/auth/login" : "/auth/register";
      await api.post(url, payload);
      toast.success(mode === "login" ? "Welcome back" : "Account created");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={async (formData) => handleSubmit(formData)}
      className="space-y-4 rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-950/70"
    >
      {mode === "register" ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
          <input name="name" placeholder="Priya Kapoor" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-coral/30 focus:ring dark:border-slate-700" required />
        </div>
      ) : null}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
        <input name="email" type="email" placeholder="team@company.com" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-coral/30 focus:ring dark:border-slate-700" required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
        <input name="password" type="password" placeholder="Minimum 8 characters" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-coral/30 focus:ring dark:border-slate-700" required />
      </div>
      {mode === "register" ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Role</label>
          <select name="role" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-coral/30 focus:ring dark:border-slate-700">
            <option value="Manager">Manager</option>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      ) : null}
      <button disabled={loading} className="w-full rounded-2xl bg-ink px-5 py-3 font-medium text-white transition hover:bg-coral disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-coral dark:hover:text-white">
        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
}
