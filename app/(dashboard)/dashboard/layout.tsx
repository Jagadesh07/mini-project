import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!cookies().get("stm_access")?.value) {
    redirect("/login");
  }

  return <main className="min-h-screen px-6 py-8 lg:px-10">{children}</main>;
}
