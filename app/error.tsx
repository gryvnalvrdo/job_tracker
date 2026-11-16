"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("JobTrail runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 text-center space-y-4">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#818cf8]">
          Service Recovery
        </div>
        <h1 className="text-xl font-bold text-text">
          Unable to load this page
        </h1>
        <p className="text-sm text-text-muted leading-relaxed">
          A temporary connection or database error occurred. Please retry or return to the dashboard.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-text text-sm font-semibold hover:border-border-hover transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
