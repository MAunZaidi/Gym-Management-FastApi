import { mockDelay } from "@/lib/api/client";
import { authStorageKey } from "@/lib/constants";
import type { AdminUser } from "@/types";

export type LoginInput = {
  email: string;
  password: string;
  remember: boolean;
};

export type SignupInput = LoginInput & {
  name: string;
};

const demoUser: AdminUser = {
  name: "ADAPT Admin",
  email: "admin@adaptgym.test",
  role: "Owner"
};

export async function login(input: LoginInput) {
  if (!input.email || !input.password) {
    throw new Error("Email and password are required.");
  }

  await mockDelay(null, 380);
  localStorage.setItem(authStorageKey, JSON.stringify({ ...demoUser, email: input.email }));
  return { user: { ...demoUser, email: input.email }, token: "mock-adapt-token" };
}

export async function signup(input: SignupInput) {
  if (!input.name || !input.email || !input.password) {
    throw new Error("All fields are required.");
  }

  await mockDelay(null, 420);
  const user: AdminUser = { name: input.name, email: input.email, role: "Owner" };
  localStorage.setItem(authStorageKey, JSON.stringify(user));
  return { user, token: "mock-adapt-token" };
}

export async function logout() {
  await mockDelay(null, 120);
  localStorage.removeItem(authStorageKey);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(authStorageKey);
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}
