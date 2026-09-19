import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getApplicationById } from "@/lib/actions/applications";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/features/StatusBadge";
import { StatusTimeline } from "@/components/features/StatusTimeline";
import { StatusUpdatePanel } from "@/components/features/StatusUpdatePanel";
import { Button } from "@/components/ui/Button";
import { DeleteApplicationButton } from "@/components/features/DeleteApplicationButton";
import { formatDate, formatSalary, getDaysAgo, needsFollowUp } from "@/lib/utils";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ApplicationDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const app = await getApplicationById(id);
  if (!app) return { title: "Lamaran tidak ditemukan" };
  return { title: `${app.companyName} — ${app.position}` };
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) notFound();

  const daysAgo = getDaysAgo(application.appliedDate);
  const followUp = needsFollowUp(application.updatedAt) && application.status !== "OFFER" && application.status !== "REJECTED";

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/applications">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Semua Lamaran
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* CoverCraft integration — part of Job Hunting Suite */}
          <a
            href={`${process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://portofolio-seven-lac-56.vercel.app"}/covercraft?job=${encodeURIComponent(application.position)}&company=${encodeURIComponent(application.companyName)}&url=${encodeURIComponent(application.jobUrl || "")}&id=${application.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="sm" className="border-[#7c3aed]/40 text-[#a78bfa] hover:bg-[#7c3aed]/10">
              ✨ Generate Cover Letter
            </Button>
          </a>
          <Link href={`/applications/${id}/edit`}>
            <Button variant="secondary" size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit
            </Button>
          </Link>
          <DeleteApplicationButton id={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="flex items-start gap-4">
              {/* Company avatar */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-[#818cf8]">
                  {application.companyName[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl font-bold text-[#e2e8f0] truncate">{application.companyName}</h1>
                  <StatusBadge status={application.status} />
                  {followUp && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/30">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Perlu Follow-up
                    </span>
                  )}
                </div>
                <p className="text-base text-[#c4cad8] font-medium">{application.position}</p>
                <p className="text-sm text-[#8892a4] mt-0.5">
                  Apply {formatDate(application.appliedDate)} · {daysAgo === 0 ? "Hari ini" : `${daysAgo} hari lalu`}
                </p>
              </div>
            </div>
          </Card>

          {/* Details grid */}
          <Card>
            <CardHeader>
              <CardTitle>Detail</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4">
              {application.jobUrl && (
                <div className="col-span-2">
                  <p className="text-xs text-[#8892a4] mb-1">Job Posting</p>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#818cf8] hover:text-[#a78bfa] transition-colors truncate block"
                  >
                    {application.jobUrl}
                  </a>
                </div>
              )}
              {(application.salaryMin || application.salaryMax) && (
                <div className="col-span-2">
                  <p className="text-xs text-[#8892a4] mb-1">Gaji</p>
                  <p className="text-sm text-[#e2e8f0]">
                    {formatSalary(application.salaryMin)} — {formatSalary(application.salaryMax)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-[#8892a4] mb-1">Dibuat</p>
                <p className="text-sm text-[#e2e8f0]">{formatDate(application.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-[#8892a4] mb-1">Diperbarui</p>
                <p className="text-sm text-[#e2e8f0]">{formatDate(application.updatedAt)}</p>
              </div>
            </div>
          </Card>

          {/* Notes */}
          {application.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan</CardTitle>
              </CardHeader>
              <p className="text-sm text-[#c4cad8] whitespace-pre-wrap leading-relaxed">
                {application.notes}
              </p>
            </Card>
          )}

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Cover Letter</CardTitle>
              </CardHeader>
              <div className="text-sm text-[#c4cad8] whitespace-pre-wrap leading-relaxed bg-[#1a1b26] p-4 rounded-lg font-serif">
                {application.coverLetter}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Status</CardTitle>
            </CardHeader>
            <StatusTimeline history={application.statusHistory} />
          </Card>
        </div>

        {/* Sidebar - Status Update */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <StatusUpdatePanel
              applicationId={application.id}
              currentStatus={application.status}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
