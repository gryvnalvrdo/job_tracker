import { SkeletonList, SkeletonStat } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-[#2e3348] bg-[#1a1d27] p-5">
          <div className="skeleton h-4 w-32 rounded mb-4" />
          <div className="skeleton h-48 w-full rounded" />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-[#2e3348] bg-[#1a1d27] p-5">
          <div className="skeleton h-4 w-32 rounded mb-4" />
          <div className="skeleton h-48 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
