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
      return NextResponse.json({ applications: 0, interviews: 0 });
    }

    const [totalApplications, interviews] = await Promise.all([
      prisma.application.count({
        where: { userId: user.id },
      }),
      prisma.application.count({
        where: {
          userId: user.id,
          status: { in: ["INTERVIEW", "OFFER"] },
        },
      }),
    ]);

    const response = NextResponse.json({
      applications: totalApplications,
      interviews,
    });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    return response;
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ applications: 0, interviews: 0 }, { status: 500 });
  }
}
