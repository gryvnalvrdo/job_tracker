import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getApplications } from "@/lib/actions/applications";
import { ApplicationStatus } from "@/generated/prisma/client";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/features/StatusBadge";
import { Card } from "@/components/ui/Card";
import { ApplicationFilters } from "@/components/features/ApplicationFilters";
import { formatDate, needsFollowUp } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/constants";


export const metadata: Metadata = { title: "Lamaran Kerja" };

interface ApplicationsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const sp = await searchParams;
  const status = sp.status as ApplicationStatus | undefined;
  const search = sp.search;
  const page = sp.page ? parseInt(sp.page) : 1;

  const { applications, total, totalPages } = await getApplications({
    status,
    search,
    page,
  });

  const hasFilters = !!status || !!search;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Lamaran Kerja</h1>
          <p className="text-sm text-[#8892a4] mt-0.5">
            {total} lamaran{hasFilters ? " (difilter)" : ""}
          </p>
        </div>
        <Link href="/applications/new">
          <Button size="sm" className="hidden sm:flex">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-20 skeleton rounded-xl" />}>
        <ApplicationFilters currentStatus={status} currentSearch={search} />
      </Suspense>

      {/* List */}
      {applications.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link key={app.id} href={`/applications/${app.id}`} className="block group">
              <Card hover className="transition-all">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-bold text-[#818cf8]">
                      {app.companyName[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#e2e8f0] group-hover:text-white transition-colors truncate">
                        {app.companyName}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                      {needsFollowUp(app.updatedAt) && app.status !== "OFFER" && app.status !== "REJECTED" && (
                        <span className="text-xs text-[#fbbf24]">• Perlu follow-up</span>
                      )}
                    </div>
                    <p className="text-sm text-[#8892a4] truncate">{app.position}</p>
                  </div>

                  {/* Date */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-xs text-[#8892a4]">{formatDate(app.appliedDate)}</p>
                  </div>

                  <svg className="w-4 h-4 text-[#4a5568] group-hover:text-[#8892a4] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {page > 1 && (
            <Link href={`/applications?page=${page - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}>
              <Button variant="secondary" size="sm">← Sebelumnya</Button>
            </Link>
          )}
          <span className="text-sm text-[#8892a4]">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/applications?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}>
              <Button variant="secondary" size="sm">Selanjutnya →</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-base font-semibold text-[#e2e8f0] mb-1">
            Tidak ada lamaran yang cocok
          </h3>
          <p className="text-sm text-[#8892a4] mb-4">Coba ubah filter atau kata kunci pencarian</p>
          <Link href="/applications">
            <Button variant="secondary" size="sm">Hapus Filter</Button>
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-[#e2e8f0] mb-1">
            Belum ada lamaran
          </h3>
          <p className="text-sm text-[#8892a4] mb-4">Mulai tambahkan lamaran kerja pertama kamu</p>
          <Link href="/applications/new">
            <Button size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Lamaran
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
