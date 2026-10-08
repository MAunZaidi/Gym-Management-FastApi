import type { Metadata } from "next";
import { AuthProvider } from "@/components/layout/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ADAPT | Train for what comes next", template: "%s | ADAPT" },
  description: "Find your pace, build your strength, and train with purpose at ADAPT."
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
