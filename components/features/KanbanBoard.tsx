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
            <div className="flex items-center justify-between mb-1">
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${col.color} backdrop-blur-sm shadow-sm`}>
                {col.label}
              </div>
              <span className="text-xs font-bold text-text bg-surface-2 px-2.5 py-1 rounded-md shadow-inner border border-border/40">
                {columnApps.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 h-full min-h-[200px] p-2.5 rounded-2xl bg-surface/30 backdrop-blur-sm border border-white/5 shadow-inner">
              {columnApps.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-text-muted/50 border-2 border-dashed border-border/50 rounded-lg p-4">
                  Empty
                </div>
              ) : (
                columnApps.map((app) => {
                  const cardContent = (
                    <div className={`p-4 bg-surface/60 backdrop-blur-md border border-white/10 rounded-xl shadow-lg transition-all duration-300 ${readOnly ? 'cursor-default' : 'hover:-translate-y-1 hover:rotate-1 hover:scale-[1.02] hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl cursor-pointer group'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">{app.companyName}</h4>
                        <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                      </div>
                      <p className="text-xs text-text-muted font-medium truncate mb-3">{app.position}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-text-muted mt-3 pt-3 border-t border-white/5">
                        <span className="truncate max-w-[120px] bg-white/5 px-2 py-0.5 rounded text-white/70">Remote</span>
                        <span className="font-mono text-white/60">{formatDate(app.appliedDate)}</span>
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
