import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats, getApplications } from "@/lib/actions/applications";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/features/StatusBadge";
import { MonthlyChart } from "@/components/features/charts/MonthlyChart";
import { StatusChart } from "@/components/features/charts/StatusChart";
import { formatDate, needsFollowUp } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Dashboard" };

const STAT_ICONS: Record<string, React.ReactNode> = {
  total: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  interview: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  ),
  offer: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  rate: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
};

export default async function DashboardPage() {
  const [stats, { applications: recentApps }] = await Promise.all([
    getDashboardStats(),
    getApplications({ page: 1 }),
  ]);

  const interviewCount =
    stats.statusData.find((s) => s.status === "INTERVIEW")?.count ?? 0;
  const offerCount =
    stats.statusData.find((s) => s.status === "OFFER")?.count ?? 0;

  const followUpApps = recentApps.filter(
    (a) =>
      needsFollowUp(a.updatedAt) &&
      a.status !== "OFFER" &&
      a.status !== "REJECTED"
  );

  const statCards = [
    {
      key: "total",
      label: "Total Lamaran",
      value: stats.total,
      sub: "semua waktu",
      color: "text-[#818cf8]",
      bg: "bg-[#6366f1]/10",
    },
    {
      key: "interview",
      label: "Interview",
      value: interviewCount,
      sub: "sedang berjalan",
      color: "text-[#fbbf24]",
      bg: "bg-[#f59e0b]/10",
    },
    {
      key: "offer",
      label: "Offer",
      value: offerCount,
      sub: "diterima",
      color: "text-[#34d399]",
      bg: "bg-[#10b981]/10",
    },
    {
      key: "rate",
      label: "Response Rate",
      value: `${stats.responseRate}%`,
      sub: "lanjut ke interview",
      color: "text-[#f87171]",
      bg: "bg-[#ef4444]/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.key} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-30 ${stat.bg}`} />
            <div className={`mb-3 w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
              {STAT_ICONS[stat.key]}
            </div>
            <p className="text-2xl font-bold text-[#e2e8f0]">{stat.value}</p>
            <p className="text-sm font-medium text-[#c4cad8] mt-0.5">{stat.label}</p>
            <p className="text-xs text-[#8892a4]">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Monthly chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Lamaran per Bulan</CardTitle>
            <span className="text-xs text-[#8892a4]">6 bulan terakhir</span>
          </CardHeader>
          <MonthlyChart data={stats.monthlyData} />
        </Card>

        {/* Status chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
          </CardHeader>
          <StatusChart data={stats.statusData} />
        </Card>
      </div>

      {/* Follow-up alerts */}
      {followUpApps.length > 0 && (
        <Card className="border-[#f59e0b]/30 bg-[#f59e0b]/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <CardTitle>Perlu Follow-up ({followUpApps.length})</CardTitle>
            </div>
            <Link href="/applications" className="text-xs text-[#818cf8] hover:underline">
              Lihat semua
            </Link>
          </CardHeader>
          <div className="space-y-2">
            {followUpApps.slice(0, 5).map((app) => (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <div className="flex items-center justify-between gap-3 py-2 hover:opacity-80 transition-opacity">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#e2e8f0] truncate">{app.companyName}</p>
                    <p className="text-xs text-[#8892a4] truncate">{app.position}</p>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Recent applications */}
      <Card>
        <CardHeader>
          <CardTitle>Lamaran Terbaru</CardTitle>
          <Link href="/applications" className="text-xs text-[#818cf8] hover:underline">
            Lihat semua
          </Link>
        </CardHeader>
        {recentApps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#8892a4] mb-3">Belum ada lamaran</p>
            <Link href="/applications/new" className="text-sm text-[#818cf8] hover:underline">
              Tambah lamaran pertama →
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {recentApps.slice(0, 5).map((app) => (
              <Link key={app.id} href={`/applications/${app.id}`} className="block">
                <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#22263a] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#818cf8]">
                      {app.companyName[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e2e8f0] truncate">{app.companyName}</p>
                    <p className="text-xs text-[#8892a4] truncate">{app.position}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-[#8892a4] hidden sm:block">
                      {formatDate(app.appliedDate)}
                    </span>
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
