import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await prisma.application.findMany({
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

    // To prevent full URL leakage if user prefers privacy, we can just return a boolean or short domain,
    // but the user agreed to show the flexing. Let's return the URL as is.

    const response = NextResponse.json({ success: true, jobs });

    // Enable CORS for all domains so the portfolio can fetch it
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error: any) {
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
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}
