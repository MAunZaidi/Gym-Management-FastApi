import type { Metadata } from "next";
import { AuthProvider } from "@/components/layout/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADAPT Gym Management System",
  description: "Modern gym management dashboard for ADAPT administrators and staff."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
