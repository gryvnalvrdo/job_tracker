"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { ApplicationStatus } from "@/generated/prisma/client";
import { STATUS_CONFIG, STATUS_FLOW } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ApplicationFiltersProps {
  currentStatus?: ApplicationStatus;
  currentSearch?: string;
}

export function ApplicationFilters({ currentStatus, currentSearch }: ApplicationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/applications?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          defaultValue={currentSearch}
          placeholder="Cari perusahaan atau posisi..."
          onChange={(e) => updateFilter("search", e.target.value || undefined)}
          className={cn(
            "w-full h-10 pl-9 pr-3 rounded-lg border border-[#2e3348] bg-[#1a1d27] text-sm text-[#e2e8f0] placeholder:text-[#4a5568]",
            "focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all",
            isPending && "opacity-70"
          )}
        />
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => updateFilter("status", undefined)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
            !currentStatus
              ? "bg-[#6366f1]/10 text-[#818cf8] border-[#6366f1]/30"
              : "text-[#8892a4] border-[#2e3348] hover:border-[#3d4465] hover:text-[#e2e8f0]"
          )}
        >
          Semua
        </button>
        {STATUS_FLOW.map((status) => {
          const config = STATUS_CONFIG[status];
          const isActive = currentStatus === status;
          return (
            <button
              key={status}
              onClick={() => updateFilter("status", isActive ? undefined : status)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                isActive
                  ? cn(config.color, config.bgColor, config.borderColor)
                  : "text-[#8892a4] border-[#2e3348] hover:border-[#3d4465] hover:text-[#e2e8f0]"
              )}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
