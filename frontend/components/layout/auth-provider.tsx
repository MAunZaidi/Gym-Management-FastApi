"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, logout as apiLogout } from "@/lib/api/auth";
import type { AdminUser } from "@/types";

type AuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  refreshUser: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(refreshUser, 0);
    return () => window.clearTimeout(timeout);
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo(() => ({ user, loading, refreshUser, logout }), [user, loading, refreshUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
