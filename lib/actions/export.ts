"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus } from "@/generated/prisma/client";
import { formatDate, formatSalary } from "@/lib/utils";

export async function exportApplicationsCSV(): Promise<{
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  try {
    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      orderBy: { appliedDate: "desc" },
      include: {
        statusHistory: { orderBy: { changedAt: "asc" } },
      },
    });

    const headers = [
      "Perusahaan",
      "Posisi",
      "Status",
      "Tanggal Apply",
      "Gaji Min",
      "Gaji Max",
      "Link Job",
      "Catatan",
      "Perlu Follow-up",
      "Terakhir Update",
    ];

    const now = new Date();
    const rows = applications.map((app) => {
      const daysSinceUpdate = Math.floor(
        (now.getTime() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const needsFollowUp =
        daysSinceUpdate >= 7 &&
        app.status !== "OFFER" &&
        app.status !== "REJECTED";

      return [
        `"${app.companyName.replace(/"/g, '""')}"`,
        `"${app.position.replace(/"/g, '""')}"`,
        STATUS_CONFIG[app.status as ApplicationStatus].label,
        formatDate(app.appliedDate),
        app.salaryMin?.toString() ?? "",
        app.salaryMax?.toString() ?? "",
        app.jobUrl ? `"${app.jobUrl}"` : "",
        app.notes ? `"${app.notes.replace(/"/g, '""').replace(/\n/g, " ")}"` : "",
        needsFollowUp ? "Ya" : "Tidak",
        formatDate(app.updatedAt),
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const date = new Date().toISOString().split("T")[0];

    return {
      success: true,
      data: csv,
      filename: `lamaran-${date}.csv`,
    };
  } catch {
    return { success: false, error: "Gagal mengekspor data." };
  }
}
