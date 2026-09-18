"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1117] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:opacity-90 hover:shadow-lg hover:shadow-[#6366f1]/25 active:scale-[0.98]",
      secondary:
        "bg-[#1a1d27] text-[#e2e8f0] border border-[#2e3348] hover:bg-[#22263a] hover:border-[#3d4465] active:scale-[0.98]",
      ghost:
        "text-[#8892a4] hover:text-[#e2e8f0] hover:bg-[#22263a] active:scale-[0.98]",
      danger:
        "bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/30 hover:bg-[#ef4444]/20 active:scale-[0.98]",
      outline:
        "border border-[#6366f1]/50 text-[#818cf8] hover:bg-[#6366f1]/10 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
