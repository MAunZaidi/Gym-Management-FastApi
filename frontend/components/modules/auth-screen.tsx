"use client";

import { useSearchParams } from "next/navigation";
import { Activity, BarChart3, Dumbbell, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/modules/auth-form";
import { FluidBackdrop } from "@/components/modules/fluid-backdrop";
import { Panel } from "@/components/ui/panel";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const ref = useGsapReveal<HTMLElement>(mode);
  const searchParams = useSearchParams();
  const forgot = searchParams.get("forgot") === "true";
  const isSignup = mode === "signup";

  return (
    <main ref={ref} className="adapt-auth relative isolate grid bg-adapt-background text-adapt-text lg:grid-cols-[1.08fr_0.92fr]">
      <FluidBackdrop />
      <section className="relative hidden min-h-[760px] overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
        <div data-reveal className="relative">
          <div className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-adapt border border-white/10 bg-adapt-primary shadow-panel">
              <Dumbbell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">ADAPT.</p>
              <p className="font-mono text-xs text-adapt-subtle">Gym Management System</p>
            </div>
          </div>
          <p className="mt-20 flex items-center gap-2 font-mono text-xs text-adapt-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-adapt-success" /> Your daily momentum
          </p>
          <h1 className="adapt-auth-title mt-5 max-w-lg">
            Your gym.<br />In motion.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-adapt-subtle">An Open-Source Application To Manage Your Gym Operations.</p>
        </div>
        <div className="relative mt-32 grid grid-cols-3 gap-4">
          {[
            ["Active Members", "1,248", Activity],
            ["Monthly Revenue", "$42K", BarChart3],
            ["Secure Access", "Admin", ShieldCheck]
          ].map(([label, value, Icon]) => (
            <Panel key={label as string} className="p-4">
              <Icon className="h-5 w-5 text-adapt-accent" />
              <p className="mt-5 text-2xl font-semibold">{value as string}</p>
              <p className="mt-1 font-mono text-[11px] text-adapt-subtle">{label as string}</p>
            </Panel>
          ))}
        </div>
      </section>
      <section className="grid place-items-center px-5 py-10 sm:p-8 lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-adapt bg-adapt-primary">
              <Dumbbell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">ADAPT</p>
              <p className="font-mono text-xs text-adapt-subtle">Gym OS</p>
            </div>
          </div>
          <Panel className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-adapt-muted pb-5">
              <span className="font-mono text-xs text-adapt-subtle">ADAPT / {isSignup ? "SIGN UP" : "SIGN IN"}</span>
              <ShieldCheck className="h-4 w-4 text-adapt-success" />
            </div>
            <h2 className="text-3xl font-medium">{isSignup ? "Create your workspace" : "Welcome back"}</h2>
            <p className="mt-2 text-sm leading-6 text-adapt-subtle">
              {forgot
                ? "Contact your gym administrator to reset your password."
                : isSignup ? "Start your next chapter with ADAPT." : "Sign in to your gym workspace."}
            </p>
            <div className="mt-6">
              <AuthForm mode={mode} />
            </div>
          </Panel>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-adapt-subtle"><ShieldCheck className="h-3.5 w-3.5" /> Staff access only</p>
        </div>
      </section>
    </main>
  );
}
