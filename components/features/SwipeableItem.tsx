"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/lib/actions/applications";
import { ApplicationStatus } from "@/generated/prisma/client";
import { STATUS_CONFIG } from "@/lib/constants";
import { showToast } from "@/components/ui/Toaster";

interface SwipeableItemProps {
  children: React.ReactNode;
  applicationId: string;
  currentStatus: ApplicationStatus;
  className?: string;
}

const SWIPE_THRESHOLD = 72; // px to commit a swipe action

// Next logical status when swiping right (advance)
const ADVANCE_MAP: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  SAVED: "APPLIED",
  APPLIED: "SCREENING",
  SCREENING: "INTERVIEW",
  INTERVIEW: "OFFER",
};

// Quick reject on left swipe (for non-terminal statuses)
const REJECT_ELIGIBLE: ApplicationStatus[] = [
  "APPLIED", "SCREENING", "INTERVIEW",
];

export function SwipeableItem({
  children,
  applicationId,
  currentStatus,
  className = "",
}: SwipeableItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [isActing, setIsActing] = useState(false);
  const router = useRouter();

  const advanceStatus = ADVANCE_MAP[currentStatus];
  const canReject = REJECT_ELIGIBLE.includes(currentStatus);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setOffset(0);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.touches[0].clientX - startXRef.current;
      if (dx > 0 && !advanceStatus) return; // can't advance terminal
      if (dx < 0 && !canReject) return;      // can't reject terminal
      // Rubber-band effect: resistance after threshold
      const clamped = Math.max(-140, Math.min(140, dx));
      setOffset(clamped);
    },
    [advanceStatus, canReject]
  );

  const handleTouchEnd = useCallback(async () => {
    if (isActing) return;

    if (offset >= SWIPE_THRESHOLD && advanceStatus) {
      setIsActing(true);
      setOffset(0);
      const result = await updateApplicationStatus({
        applicationId,
        status: advanceStatus,
      });
      setIsActing(false);
      if (result.success) {
        showToast(`→ ${STATUS_CONFIG[advanceStatus].label}`, "success");
        router.refresh();
      } else {
        showToast(result.error ?? "Gagal update", "error");
      }
    } else if (offset <= -SWIPE_THRESHOLD && canReject) {
      setIsActing(true);
      setOffset(0);
      const result = await updateApplicationStatus({
        applicationId,
        status: "REJECTED",
      });
      setIsActing(false);
      if (result.success) {
        showToast("Ditandai Rejected", "error");
        router.refresh();
      } else {
        showToast(result.error ?? "Gagal update", "error");
      }
    } else {
      setOffset(0);
    }
  }, [offset, advanceStatus, canReject, applicationId, isActing, router]);

  // Opacity of action hints
  const rightOpacity = Math.min(1, offset / SWIPE_THRESHOLD);
  const leftOpacity = Math.min(1, -offset / SWIPE_THRESHOLD);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl select-none ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {/* LEFT hint — advance (swipe right) */}
      {advanceStatus && (
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-5 pr-8 rounded-l-xl z-0"
          style={{
            background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
            opacity: rightOpacity,
            pointerEvents: "none",
          }}
        >
          <span className="text-white font-semibold text-sm flex items-center gap-1.5">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {STATUS_CONFIG[advanceStatus].label}
          </span>
        </div>
      )}

      {/* RIGHT hint — reject (swipe left) */}
      {canReject && (
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-5 pl-8 rounded-r-xl z-0"
          style={{
            background: "linear-gradient(270deg, #ef4444 0%, #dc2626 100%)",
            opacity: leftOpacity,
            pointerEvents: "none",
          }}
        >
          <span className="text-white font-semibold text-sm flex items-center gap-1.5">
            Rejected
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </div>
      )}

      {/* Draggable card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? "transform 0.3s cubic-bezier(.22,.68,0,1.2)" : "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {/* Hint label shown once on first render (mobile only) */}
    </div>
  );
}
