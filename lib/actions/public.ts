"use server";

import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/generated/prisma/client";

export async function getPublicApplications(params: {
  email: string;
  status?: ApplicationStatus;
  search?: string;
  page?: number;
}) {
  const { email, status, search, page = 1 } = params;
  const limit = 10;
  const skip = (page - 1) * limit;

  // First, find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true },
  });

  if (!user) {
    return { applications: [], total: 0, totalPages: 0, userName: null };
  }

  const where = {
    userId: user.id,
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

  return { applications, total, totalPages: Math.ceil(total / limit), userName: user.name };
}
