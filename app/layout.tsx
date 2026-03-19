import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { GlobalUserBar } from "@/components/global-user-bar";

export const metadata: Metadata = {
  title: "Project Xeno - Project Management System",
  description: "Project Xeno is a modern project management system for planning, execution, notifications, and team coordination."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen">
              <header className="sticky top-0 z-40 border-b border-white/40 bg-white/35 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/50">
                <GlobalUserBar />
              </header>
              {children}
            </div>
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
