"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import clsx from "clsx";
import { api } from "@/lib/api/client";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await api.post("/auth/logout");
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className={clsx("rounded-full bg-coral px-4 py-2 font-semibold text-white hover:bg-[#ff7b5e]", className)}>
      Logout
    </button>
  );
}
