"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "error";
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [{ id, ...toast }, ...current].slice(0, 4));
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="fixed right-4 top-4 z-[60] grid w-[calc(100%-2rem)] max-w-sm gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="adapt-toast rounded-adapt border border-adapt-muted bg-adapt-surface p-4 shadow-adapt">
            <div className="flex items-start gap-3">
              {toast.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-adapt-success" /> : <Info className="mt-0.5 h-5 w-5 text-adapt-primary" />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-adapt-text">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm text-adapt-subtle">{toast.description}</p> : null}
              </div>
              <Button
                variant="ghost"
                className={cn("h-8 min-h-8 px-2")}
                icon={<X className="h-4 w-4" />}
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
