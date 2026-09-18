"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema, updateStatusSchema } from "@/lib/validations/application";
import { ApplicationStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ── Create ─────────────────────────────────────────────────────────────────
export async function createApplication(
  formData: unknown
): Promise<ActionResult<{ id: string }>> {
  const userId = await getAuthUserId();

  const parsed = applicationSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Data tidak valid" };
  }

  const { companyName, position, jobUrl, appliedDate, salaryMin, salaryMax, notes } = parsed.data;

  try {
    const application = await prisma.application.create({
      data: {
        userId,
        companyName,
        position,
        jobUrl: jobUrl || null,
        appliedDate: new Date(appliedDate),
        salaryMin: salaryMin ?? null,
        salaryMax: salaryMax ?? null,
        notes: notes || null,
        status: "APPLIED",
        statusHistory: {
          create: { status: "APPLIED", note: "Lamaran dikirim" },
        },
      },
      select: { id: true },
    });

    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, data: application };
  } catch {
    return { success: false, error: "Gagal membuat lamaran. Coba lagi." };
  }
}

// ── Update ─────────────────────────────────────────────────────────────────
export async function updateApplication(
  id: string,
  formData: unknown
): Promise<ActionResult<void>> {
  const userId = await getAuthUserId();

  const parsed = applicationSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Data tidak valid" };
  }

  const { companyName, position, jobUrl, appliedDate, salaryMin, salaryMax, notes } = parsed.data;

  try {
    const existing = await prisma.application.findFirst({ where: { id, userId } });
    if (!existing) return { success: false, error: "Lamaran tidak ditemukan" };

    await prisma.application.update({
      where: { id },
      data: {
        companyName,
        position,
        jobUrl: jobUrl || null,
        appliedDate: new Date(appliedDate),
        salaryMin: salaryMin ?? null,
        salaryMax: salaryMax ?? null,
        notes: notes || null,
      },
    });

    revalidatePath(`/applications/${id}`);
    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Gagal memperbarui lamaran. Coba lagi." };
  }
}

// ── Update Status ──────────────────────────────────────────────────────────
export async function updateApplicationStatus(
  input: unknown
): Promise<ActionResult<void>> {
  const userId = await getAuthUserId();

  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Data tidak valid" };
  }

  const { applicationId, status, note } = parsed.data;

  try {
    const existing = await prisma.application.findFirst({
      where: { id: applicationId, userId },
    });
    if (!existing) return { success: false, error: "Lamaran tidak ditemukan" };

    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status },
      }),
      prisma.statusHistory.create({
        data: {
          applicationId,
          status,
          note: note ?? null,
        },
      }),
    ]);

    revalidatePath(`/applications/${applicationId}`);
    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Gagal memperbarui status. Coba lagi." };
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────
export async function deleteApplication(id: string): Promise<ActionResult<void>> {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.application.findFirst({ where: { id, userId } });
    if (!existing) return { success: false, error: "Lamaran tidak ditemukan" };

    await prisma.application.delete({ where: { id } });

    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Gagal menghapus lamaran. Coba lagi." };
  }
}

// ── Read ───────────────────────────────────────────────────────────────────
export async function getApplications(params: {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
}) {
  const userId = await getAuthUserId();
  const { status, search, page = 1 } = params;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { companyName: { contains: search, mode: "insensitive" as const } },
        { position: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { appliedDate: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        companyName: true,
        position: true,
        status: true,
        appliedDate: true,
        updatedAt: true,
        salaryMin: true,
        salaryMax: true,
        jobUrl: true,
      },
    }),
    prisma.application.count({ where }),
  ]);

  return { applications, total, totalPages: Math.ceil(total / limit) };
}

export async function getApplicationById(id: string) {
  const userId = await getAuthUserId();

  return prisma.application.findFirst({
    where: { id, userId },
    include: {
      statusHistory: {
        orderBy: { changedAt: "asc" },
      },
    },
  });
}

export async function getDashboardStats() {
  const userId = await getAuthUserId();

  // Start of 6 months ago (beginning of that month)
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [total, byStatus, recentApplications] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    // Only fetch last 6 months — avoids loading all records into memory
    prisma.application.findMany({
      where: {
        userId,
        appliedDate: { gte: sixMonthsAgo },
      },
      orderBy: { appliedDate: "asc" },
      select: { appliedDate: true, status: true },
    }),
  ]);

  // Response rate = (INTERVIEW + OFFER) / total * 100
  const advancedStatuses: ApplicationStatus[] = ["INTERVIEW", "OFFER"];
  const advanced = byStatus
    .filter((s) => advancedStatuses.includes(s.status))
    .reduce((sum, s) => sum + s._count.status, 0);
  const responseRate = total > 0 ? Math.round((advanced / total) * 100) : 0;

  // Monthly chart — last 6 months
  const monthlyData: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("id-ID", { month: "short", year: "2-digit" });
    const count = recentApplications.filter((a) => {
      const aDate = new Date(a.appliedDate);
      return aDate.getFullYear() === d.getFullYear() && aDate.getMonth() === d.getMonth();
    }).length;
    monthlyData.push({ month: label, count });
  }

  const statusData = byStatus.map((s) => ({
    status: s.status,
    count: s._count.status,
  }));

  return { total, statusData, monthlyData, responseRate };
}
