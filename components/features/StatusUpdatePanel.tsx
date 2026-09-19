"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/lib/actions/applications";
import { ApplicationStatus } from "@/generated/prisma/client";
import { STATUS_CONFIG, STATUS_FLOW } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/Toaster";

interface StatusUpdatePanelProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function StatusUpdatePanel({ applicationId, currentStatus }: StatusUpdatePanelProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState<ApplicationStatus | null>(null);

  const nextStatuses = STATUS_FLOW.filter((s) => s !== currentStatus && s !== "APPLIED");

  async function handleUpdate(status: ApplicationStatus) {
    setLoading(status);
    const result = await updateApplicationStatus({ applicationId, status, note: note || undefined });
    setLoading(null);

    if (!result.success) {
      showToast(result.error, "error");
    } else {
      showToast(`Status diperbarui ke ${STATUS_CONFIG[status].label}`, "success");
      setNote("");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Status Saat Ini</p>
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium",
          STATUS_CONFIG[currentStatus].color,
          STATUS_CONFIG[currentStatus].bgColor,
          STATUS_CONFIG[currentStatus].borderColor
        )}>
          <span className={cn("w-2 h-2 rounded-full", STATUS_CONFIG[currentStatus].dotColor)} />
          {STATUS_CONFIG[currentStatus].label}
        </div>
      </div>

      {/* Catatan */}
      <div>
        <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-2">
          Catatan (opsional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tambahkan catatan tentang perubahan status..."
          rows={2}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle resize-none focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all"
        />
      </div>

      {/* Update buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Update Status</p>
        <div className="grid grid-cols-2 gap-2">
          {nextStatuses.map((status) => {
            const config = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => handleUpdate(status)}
                disabled={!!loading}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
                  config.color, config.bgColor, config.borderColor,
                  "hover:brightness-110"
                )}
              >
                {loading === status ? (
                  <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", config.dotColor)} />
                )}
                {config.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
