"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await api.post("/auth/logout");
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="rounded-full bg-coral px-4 py-2 font-semibold text-white">
      Logout
    </button>
  );
}
