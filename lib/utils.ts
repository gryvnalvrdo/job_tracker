import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateInput(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}

export function formatSalary(amount: number | null | undefined): string {
  if (!amount) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDaysAgo(date: Date | string): number {
  const now = new Date();
  const then = new Date(date);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDaysSinceLastUpdate(updatedAt: Date | string): number {
  return getDaysAgo(updatedAt);
}

export function needsFollowUp(updatedAt: Date | string, thresholdDays = 7): boolean {
  return getDaysAgo(updatedAt) >= thresholdDays;
}

export function formatMonthYear(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
