import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublicApplications } from "@/lib/actions/public";
import { ApplicationStatus } from "@/generated/prisma/client";
import { Button } from "@/components/ui/Button";
import { ApplicationFilters } from "@/components/features/ApplicationFilters";
import { ApplicationList } from "@/components/features/ApplicationList";
import { KanbanBoard } from "@/components/features/KanbanBoard";
import { STATUS_CONFIG } from "@/lib/constants";

export const metadata: Metadata = { title: "Live Agent Activity | JobTrail" };

interface PublicApplicationsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
    view?: string;
  }>;
}

export default async function PublicApplicationsPage({ searchParams }: PublicApplicationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const sp = resolvedSearchParams;
  const status = sp.status as ApplicationStatus | undefined;
  const search = sp.search;
  const page = sp.page ? parseInt(sp.page) : 1;
  const view = sp.view || "list";

  // Use the admin's email specifically for the portfolio integration
  const adminEmail = "gryvnalvrdo@gmail.com";

  const { applications, total, totalPages, userName } = await getPublicApplications({
    email: adminEmail,
    status,
    search,
    page,
  });

  const hasFilters = !!status || !!search;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Public Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-[#6366f1]/10 border border-[#6366f1]/20 p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-red-500 uppercase">Live Agent Activity</span>
            </div>
            <h1 className="text-3xl font-bold text-text mb-2">
              {userName ? `${userName}'s JobTrail` : 'JobTrail Public View'}
            </h1>
            <p className="text-text-muted">
              Monitoring and auto-applying via n8n automation. This is a read-only view.
            </p>
          </div>
          <div className="relative z-10">
            <Link href="https://portofolio-seven-lac-56.vercel.app">
              <Button variant="outline" className="border-[#6366f1]/30 hover:bg-[#6366f1]/20">
                Back to Portfolio
              </Button>
            </Link>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#6366f1]/20 rounded-full blur-3xl" />
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-20 skeleton rounded-xl" />}>
          <ApplicationFilters currentStatus={status} currentSearch={search} />
        </Suspense>

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="bg-surface-2 p-1 rounded-lg inline-flex">
            <Link href={`/public/live?view=list${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === "list" ? "bg-surface shadow-sm text-text font-medium" : "text-text-muted hover:text-text"}`}>
              List
            </Link>
            <Link href={`/public/live?view=board${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === "board" ? "bg-surface shadow-sm text-text font-medium" : "text-text-muted hover:text-text"}`}>
              Board
            </Link>
          </div>
        </div>

        {/* List / Board in ReadOnly Mode */}
        {applications.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : view === "board" ? (
          <KanbanBoard applications={applications} readOnly={true} />
        ) : (
          <ApplicationList applications={applications as any} readOnly={true} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {page > 1 && (
              <Link href={`/public/live?page=${page - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}>
                <Button variant="secondary" size="sm">← Previous</Button>
              </Link>
            )}
            <span className="text-sm text-text-muted bg-surface px-4 py-1.5 rounded-md border border-border">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/public/live?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}>
                <Button variant="secondary" size="sm">Next →</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-surface/50 border border-border/50 rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold text-text mb-1">
            No matching applications
          </h3>
          <p className="text-sm text-text-muted mb-4">Try adjusting your filters or search terms</p>
          <Link href="/public/live">
            <Button variant="secondary" size="sm">Clear Filters</Button>
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-text mb-1">
            No applications yet
          </h3>
          <p className="text-sm text-text-muted">The automation agent hasn't logged any applications.</p>
        </>
      )}
    </div>
  );
}
