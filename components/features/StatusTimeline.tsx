import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus } from "@/generated/prisma/client";
import { formatDate } from "@/lib/utils";

interface StatusHistoryItem {
  id: string;
  status: ApplicationStatus;
  changedAt: Date;
  note: string | null;
}

interface StatusTimelineProps {
  history: StatusHistoryItem[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-text-muted text-center py-4">
        Belum ada riwayat perubahan status
      </p>
    );
  }

  return (
    <div className="relative space-y-0">
      {history.map((item, idx) => {
        const config = STATUS_CONFIG[item.status];
        const isLast = idx === history.length - 1;

        return (
          <div key={item.id} className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-[#2e3348]" />
            )}

            {/* Dot */}
            <div className={cn(
              "relative flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#0f1117] flex items-center justify-center mt-0.5",
              config.dotColor
            )}>
              {isLast && (
                <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: "currentColor" }} />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-5 flex-1", isLast && "pb-0")}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-sm font-semibold", config.color)}>
                  {config.label}
                </span>
                <span className="text-xs text-text-muted">·</span>
                <span className="text-xs text-text-muted">{formatDate(item.changedAt)}</span>
              </div>
              {item.note && (
                <p className="mt-1 text-sm text-text bg-surface-2 rounded-lg px-3 py-2 border border-border">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
