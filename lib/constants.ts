import { ApplicationStatus } from "@/generated/prisma/client";

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string; borderColor: string; dotColor: string }
> = {
  SAVED: {
    label: "Tersimpan",
    color: "text-[#38bdf8]",
    bgColor: "bg-[#0284c7]/10",
    borderColor: "border-[#0284c7]/30",
    dotColor: "bg-[#0ea5e9]",
  },
  APPLIED: {
    label: "Applied",
    color: "text-[#818cf8]",
    bgColor: "bg-[#6366f1]/10",
    borderColor: "border-[#6366f1]/30",
    dotColor: "bg-[#6366f1]",
  },
  SCREENING: {
    label: "Screening",
    color: "text-[#a78bfa]",
    bgColor: "bg-[#8b5cf6]/10",
    borderColor: "border-[#8b5cf6]/30",
    dotColor: "bg-[#8b5cf6]",
  },
  INTERVIEW: {
    label: "Interview",
    color: "text-[#fbbf24]",
    bgColor: "bg-[#f59e0b]/10",
    borderColor: "border-[#f59e0b]/30",
    dotColor: "bg-[#f59e0b]",
  },
  OFFER: {
    label: "Offer",
    color: "text-[#34d399]",
    bgColor: "bg-[#10b981]/10",
    borderColor: "border-[#10b981]/30",
    dotColor: "bg-[#10b981]",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-[#f87171]",
    bgColor: "bg-[#ef4444]/10",
    borderColor: "border-[#ef4444]/30",
    dotColor: "bg-[#ef4444]",
  },
};

export const STATUS_FLOW: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export const FOLLOW_UP_THRESHOLD_DAYS = 7;

export const ITEMS_PER_PAGE = 10;

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/applications", label: "Lamaran", icon: "Briefcase" },
] as const;
