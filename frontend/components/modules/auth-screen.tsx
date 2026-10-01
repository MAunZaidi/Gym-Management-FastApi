"use client";

import { useSearchParams } from "next/navigation";
import { Activity, BarChart3, Dumbbell, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/modules/auth-form";
import { Panel } from "@/components/ui/panel";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const ref = useGsapReveal<HTMLDivElement>();
  const searchParams = useSearchParams();
  const forgot = searchParams.get("forgot") === "true";
  const isSignup = mode === "signup";

  return (
    <main className="grid min-h-screen bg-adapt-background text-adapt-text lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden border-r border-adapt-muted p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(109,93,251,0.34),transparent_22rem)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-adapt bg-adapt-primary">
              <Dumbbell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">ADAPT</p>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-adapt-subtle">Gym Management System</p>
            </div>
          </div>
          <h1 className="mt-20 max-w-3xl text-6xl font-medium leading-[1.04] tracking-normal">
            Run memberships, payments, classes, and attendance from one calm command center.
          </h1>
        </div>
        <div className="relative grid grid-cols-3 gap-4">
          {[
            ["Active Members", "1,248", Activity],
            ["Monthly Revenue", "$42K", BarChart3],
            ["Secure Access", "Admin", ShieldCheck]
          ].map(([label, value, Icon]) => (
            <Panel key={label as string} className="p-4">
              <Icon className="h-5 w-5 text-adapt-primary" />
              <p className="mt-5 text-2xl font-semibold">{value as string}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-adapt-subtle">{label as string}</p>
            </Panel>
          ))}
        </div>
      </section>
      <section className="grid place-items-center p-5 sm:p-8">
        <div ref={ref} className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-adapt bg-adapt-primary">
              <Dumbbell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">ADAPT</p>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-adapt-subtle">Gym OS</p>
            </div>
          </div>
          <Panel className="p-6 sm:p-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-adapt-primary">Authenticated access</p>
            <h2 className="mt-3 text-3xl font-semibold">{isSignup ? "Create your ADAPT workspace" : "Welcome back"}</h2>
            <p className="mt-2 text-sm leading-6 text-adapt-subtle">
              {forgot
                ? "Password reset is ready for API integration. For now, use the demo credentials already filled in."
                : "Use the demo credentials or enter any valid email and an 8+ character password."}
            </p>
            <div className="mt-6">
              <AuthForm mode={mode} />
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}
