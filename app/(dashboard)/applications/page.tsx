import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getApplications } from "@/lib/actions/applications";
import { ApplicationStatus } from "@/generated/prisma/client";
import { cookies } from "next/headers";
import { getDictionary, Language } from "@/lib/dictionary";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/features/StatusBadge";
import { Card } from "@/components/ui/Card";
import { ApplicationFilters } from "@/components/features/ApplicationFilters";
import { ApplicationList } from "@/components/features/ApplicationList";
import { ExportButton } from "@/components/features/ExportButton";
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
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Language) || "en";
  const dict = getDictionary(lang).applications;

  const resolvedSearchParams = await searchParams;
  const sp = resolvedSearchParams;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">{dict.title}</h1>
          <p className="text-text-muted">{dict.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton />
          <Link href="/applications/new">
            <Button>
              Tambah
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-20 skeleton rounded-xl" />}>
        <ApplicationFilters currentStatus={status} currentSearch={search} />
      </Suspense>

      {/* List */}
      {applications.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <ApplicationList applications={applications} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {page > 1 && (
            <Link href={`/applications?page=${page - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}>
              <Button variant="secondary" size="sm">← Sebelumnya</Button>
            </Link>
          )}
          <span className="text-sm text-text-muted">
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
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-base font-semibold text-text mb-1">
            Tidak ada lamaran yang cocok
          </h3>
          <p className="text-sm text-text-muted mb-4">Coba ubah filter atau kata kunci pencarian</p>
          <Link href="/applications">
            <Button variant="secondary" size="sm">Hapus Filter</Button>
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-text mb-1">
            Belum ada lamaran
          </h3>
          <p className="text-sm text-text-muted mb-4">Mulai tambahkan lamaran kerja pertama kamu</p>
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
