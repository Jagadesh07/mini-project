import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  const isAuthenticated = !!cookies().get("stm_access")?.value;
  redirect(isAuthenticated ? "/dashboard" : "/login");
}
