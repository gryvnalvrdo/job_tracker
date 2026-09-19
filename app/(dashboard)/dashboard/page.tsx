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
import { cookies } from "next/headers";
import { getDictionary, Language } from "@/lib/dictionary";

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
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Language) || "en";
  const dict = getDictionary(lang).dashboard;

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
      label: dict.stats.total,
      value: stats.total,
      sub: dict.stats.totalSub,
      color: "text-primary",
      bg: "bg-primary/10",
      icon: STAT_ICONS.total,
    },
    {
      key: "interview",
      label: dict.stats.interview,
      value: interviewCount,
      sub: dict.stats.interviewSub,
      color: "text-[#fbbf24]",
      bg: "bg-[#f59e0b]/10",
      icon: STAT_ICONS.interview,
    },
    {
      key: "offer",
      label: dict.stats.offer,
      value: offerCount,
      sub: dict.stats.offerSub,
      color: "text-[#34d399]",
      bg: "bg-[#10b981]/10",
      icon: STAT_ICONS.offer,
    },
    {
      key: "rejected",
      label: dict.stats.rejected,
      value: stats.statusData.find((s) => s.status === "REJECTED")?.count ?? 0,
      sub: dict.stats.rejectedSub,
      color: "text-[#f87171]",
      bg: "bg-[#ef4444]/10",
      icon: STAT_ICONS.rate,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2 tracking-tight">
            {dict.title}
          </h1>
          <p className="text-text-muted">
            {dict.subtitle}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.key} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-30 ${stat.bg}`} />
            <div className={`mb-3 w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
              {STAT_ICONS[stat.key]}
            </div>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-sm font-medium text-text mt-0.5">{stat.label}</p>
            <p className="text-xs text-text-muted">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 flex flex-col h-full bg-surface">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text">{dict.charts.funnelTitle}</h3>
            <span className="text-xs text-text-muted">{dict.charts.funnelSub}</span>
          </div>
          <div className="flex-1 min-h-[200px]">
            <StatusChart data={stats.statusData} />
          </div>
        </Card>
        <Card className="p-5 flex flex-col h-full bg-surface">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text">{dict.charts.monthlyTitle}</h3>
            <span className="text-xs text-text-muted">{dict.charts.monthlySub}</span>
          </div>
          <div className="flex-1 min-h-[200px]">
            <MonthlyChart data={stats.monthlyData} />
          </div>
        </Card>
      </div>

      {/* Follow-up alerts */}
      {followUpApps.length > 0 && (
        <Card className="border-[#f59e0b]/30 bg-[#f59e0b]/5">
          <div className="p-4 border-b border-border/50 bg-[#f59e0b]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-semibold text-[#fbbf24]">{dict.followUp.title} ({followUpApps.length})</h3>
            </div>
            <Link href="/applications" className="text-xs text-primary hover:underline">
              {dict.followUp.viewAll}
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {followUpApps.slice(0, 5).map((app) => (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <div className="flex items-center justify-between gap-3 py-2 hover:opacity-80 transition-opacity">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{app.companyName}</p>
                    <p className="text-xs text-text-muted truncate">{app.position}</p>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Recent applications */}
      <Card className="bg-surface h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
          <CardTitle className="text-base">{dict.recent.title}</CardTitle>
          <Link href="/applications" className="text-xs text-primary hover:underline">
            {dict.recent.viewAll}
          </Link>
        </CardHeader>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
