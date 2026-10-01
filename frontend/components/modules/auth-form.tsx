"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { login, signup } from "@/lib/api/auth";
import { validateEmail } from "@/lib/validation";
import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@adaptgym.test");
  const [password, setPassword] = useState("password123");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isSignup && name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup({ name, email, password, remember });
      } else {
        await login({ email, password, remember });
      }
      refreshUser();
      showToast({
        type: "success",
        title: isSignup ? "Workspace created" : "Welcome back",
        description: "Redirecting you to the operations dashboard."
      });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {isSignup ? (
        <div className="relative">
          <UserRound className="absolute left-3 top-[39px] h-4 w-4 text-adapt-subtle" />
          <FormField label="Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" className="pl-9" />
        </div>
      ) : null}
      <div className="relative">
        <Mail className="absolute left-3 top-[39px] h-4 w-4 text-adapt-subtle" />
        <FormField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@adaptgym.test" className="pl-9" />
      </div>
      <div className="relative">
        <LockKeyhole className="absolute left-3 top-[39px] h-4 w-4 text-adapt-subtle" />
        <FormField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="pl-9 pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute right-3 top-[37px] rounded p-1 text-adapt-subtle transition hover:text-adapt-text"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="inline-flex items-center gap-2 text-adapt-subtle">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-adapt-primary" />
          Remember me
        </label>
        <Link href="/login?forgot=true" className="font-medium text-adapt-primary hover:text-white">
          Forgot password?
        </Link>
      </div>
      {error ? <div className="rounded-adapt border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">{error}</div> : null}
      <Button type="submit" disabled={loading} icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}>
        {isSignup ? "Create ADAPT account" : "Login to ADAPT"}
      </Button>
      <p className="text-center text-sm text-adapt-subtle">
        {isSignup ? "Already managing a gym?" : "New to ADAPT?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-adapt-primary hover:text-white">
          {isSignup ? "Login" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
