import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "Smart Task & Project Management System",
  description: "Production-ready task, project and team operations starter built with Next.js, MongoDB and Socket.io."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
