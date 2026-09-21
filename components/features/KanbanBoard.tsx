"use client";

import Link from "next/link";
import { ApplicationStatus } from "@/generated/prisma/client";
import { formatDate } from "@/lib/utils";
import { ApplicationData } from "./ApplicationList";

interface KanbanBoardProps {
  applications: ApplicationData[];
  readOnly?: boolean;
}

const KANBAN_COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: "APPLIED", label: "Applied", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: "INTERVIEW", label: "Interviewing", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { id: "OFFER", label: "Offer", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { id: "REJECTED", label: "Rejected", color: "bg-red-500/10 text-red-500 border-red-500/20" },
];

export function KanbanBoard({ applications, readOnly = false }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
      {KANBAN_COLUMNS.map((col) => {
        const columnApps = applications.filter((app) => app.status === col.id);
        
        return (
          <div key={col.id} className="min-w-[280px] w-[300px] flex-shrink-0 snap-start flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${col.color}`}>
                {col.label}
              </div>
              <span className="text-xs font-medium text-text-muted bg-surface-2 px-2 py-1 rounded-md">
                {columnApps.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 h-full min-h-[150px] p-2 rounded-xl bg-surface/50 border border-border/50">
              {columnApps.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-text-muted/50 border-2 border-dashed border-border/50 rounded-lg p-4">
                  Empty
                </div>
              ) : (
                columnApps.map((app) => {
                  const cardContent = (
                    <div className={`p-3 bg-surface border border-border rounded-lg shadow-sm transition-all ${readOnly ? 'cursor-default' : 'hover:border-primary/50 hover:shadow-md cursor-pointer'}`}>
                      <h4 className="text-sm font-semibold text-text truncate mb-0.5">{app.companyName}</h4>
                      <p className="text-xs text-text-muted truncate mb-2">{app.position}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-text-muted mt-3 pt-2 border-t border-border/50">
                        <span className="truncate max-w-[120px]">Remote</span>
                        <span>{formatDate(app.appliedDate)}</span>
                      </div>
                    </div>
                  );
                  
                  return readOnly ? (
                    <div key={app.id} className="block">
                      {cardContent}
                    </div>
                  ) : (
                    <Link href={`/applications/${app.id}`} key={app.id} className="block">
                      {cardContent}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
