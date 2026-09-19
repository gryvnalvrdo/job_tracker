"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export function DemoClient() {
  useEffect(() => {
    signIn("credentials", { 
      email: "demo@jobtrail.app", 
      password: "demo", 
      callbackUrl: "/dashboard" 
    });
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <p className="text-text-muted text-sm font-medium animate-pulse">Logging you in automatically...</p>
      </div>
    </div>
  );
}
