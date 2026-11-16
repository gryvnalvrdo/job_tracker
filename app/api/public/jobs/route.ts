import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ownerEmail = process.env.AUTOAPPLY_USER_EMAIL || "gryvnalvrdo@gmail.com";
    const user = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (!user) {
      return NextResponse.json({ success: true, jobs: [] });
    }

    const jobs = await prisma.application.findMany({
      where: { userId: user.id },
      take: 8,
      orderBy: {
        appliedDate: "desc",
      },
      select: {
        id: true,
        companyName: true,
        position: true,
        status: true,
        appliedDate: true,
        jobUrl: true,
      },
    });

    const response = NextResponse.json({ success: true, jobs });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    // Serve traffic spikes from Edge CDN for 30s and revalidate in background
    response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    return response;
  } catch (error: unknown) {
    console.error("Public API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch latest jobs" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
