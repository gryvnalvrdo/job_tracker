import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus } from "@/generated/prisma/client";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border",
        config.color,
        config.bgColor,
        config.borderColor,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"
      )}
    >
      <span className={cn("rounded-full flex-shrink-0", config.dotColor, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {config.label}
    </span>
  );
}
