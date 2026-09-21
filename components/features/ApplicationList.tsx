"use client";

import { useState } from "react";
import Link from "next/link";
import { Application } from "@/generated/prisma/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/features/StatusBadge";
import { SwipeableItem } from "@/components/features/SwipeableItem";
import { formatDate, needsFollowUp } from "@/lib/utils";
import { deleteApplications } from "@/lib/actions/applications";

import { getApplications } from "@/lib/actions/applications";

export type ApplicationData = NonNullable<Awaited<ReturnType<typeof getApplications>>>["applications"][0];

interface ApplicationListProps {
  applications: ApplicationData[];
  readOnly?: boolean;
}

export function ApplicationList({ applications, readOnly = false }: ApplicationListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((app) => app.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Yakin ingin menghapus ${selectedIds.length} lamaran?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteApplications(selectedIds);
    setIsDeleting(false);

    if (result.success) {
      setSelectedIds([]);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      {!readOnly && (
        <div className="flex items-center justify-between bg-[#1e2433] p-3 rounded-xl border border-[#2e364f]">
        <div className="flex items-center gap-3 pl-2 cursor-pointer select-none" onClick={toggleSelectAll}>
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[#4a5568] bg-[#0f1219] text-primary focus:ring-[#6366f1]/50 cursor-pointer pointer-events-none"
            checked={selectedIds.length === applications.length && applications.length > 0}
            readOnly
          />
          <span className="text-sm font-medium text-text">
            {selectedIds.length > 0 ? `${selectedIds.length} dipilih` : "Pilih Semua"}
          </span>
        </div>
        
        {selectedIds.length > 0 && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isDeleting ? "Menghapus..." : "Hapus Terpilih"}
          </Button>
        )}
      </div>
      )}

      {/* Swipe hint — mobile only */}
      <p className="text-xs text-text-subtle text-center py-1 sm:hidden opacity-60">
        ← Geser untuk Rejected &nbsp;·&nbsp; Geser untuk Maju →
      </p>

      {/* List */}
      <div className="space-y-3">
        {applications.map((app) => {
          const isSelected = selectedIds.includes(app.id);
          return (
            <SwipeableItem
              key={app.id}
              applicationId={app.id}
              currentStatus={app.status}
              readOnly={readOnly}
            >
            <Card key={app.id} hover={!readOnly} className={`transition-all ${isSelected ? "border-[#6366f1]/50 bg-[#6366f1]/5" : ""}`}>
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                {!readOnly && (
                  <div 
                    className="pl-1 flex items-center justify-center cursor-pointer self-stretch py-2"
                    onClick={() => toggleSelect(app.id)}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[#4a5568] bg-[#0f1219] text-primary focus:ring-[#6366f1]/50 cursor-pointer pointer-events-none"
                      checked={isSelected}
                      readOnly
                    />
                  </div>
                )}

                <Link 
                  href={readOnly ? "#" : `/applications/${app.id}`} 
                  className={`flex-1 flex items-center gap-4 min-w-0 group py-2 ${readOnly ? 'cursor-default pointer-events-none' : ''}`}
                  onClick={(e) => { if (readOnly) e.preventDefault(); }}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-bold text-primary">
                      {app.companyName[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-text group-hover:text-white transition-colors truncate">
                        {app.companyName}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                      {needsFollowUp(app.updatedAt) && app.status !== "OFFER" && app.status !== "REJECTED" && (
                        <span className="text-xs text-[#fbbf24]">• Perlu follow-up</span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted truncate">{app.position}</p>
                  </div>

                  {/* Date */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-xs text-text-muted">{formatDate(app.appliedDate)}</p>
                  </div>

                  <svg className="w-4 h-4 text-text-subtle group-hover:text-text-muted transition-colors flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Card>
            </SwipeableItem>
          );
        })}
      </div>
    </div>
  );
}
