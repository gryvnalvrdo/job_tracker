"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = (message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  // Expose globally for server action results
  // Dependency array is intentionally empty: we only need to register the function once on mount.
  // The `toast` closure captures `setToasts` which is stable across renders.
  useEffect(() => {
    (window as unknown as { __toast: typeof toast }).__toast = toast;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const icons = {
    success: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  const colors = {
    success: "bg-[#10b981]/10 border-[#10b981]/30 text-[#34d399]",
    error: "bg-[#ef4444]/10 border-[#ef4444]/30 text-[#f87171]",
    info: "bg-[#6366f1]/10 border-[#6366f1]/30 text-primary",
    warning: "bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#fbbf24]",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border animate-in",
            "shadow-xl backdrop-blur-sm max-w-sm",
            colors[t.type]
          )}
        >
          <span className="flex-shrink-0 mt-0.5">{icons[t.type]}</span>
          <p className="text-sm flex-1">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Tutup notifikasi"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// Helper to fire toasts from outside React tree
export function showToast(message: string, type: ToastType = "info") {
  const fn = (window as unknown as { __toast?: (m: string, t: ToastType) => void }).__toast;
  if (fn) fn(message, type);
}
