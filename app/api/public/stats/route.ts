import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const demoEmail = "gryvnalvrdo@gmail.com";
    const user = await prisma.user.findUnique({
      where: { email: demoEmail }
    });

    if (!user) {
      return NextResponse.json({ applications: 0, interviews: 0 });
    }

    const totalApplications = await prisma.application.count({
      where: { userId: user.id }
    });

    const interviews = await prisma.application.count({
      where: { 
        userId: user.id,
        status: { in: ["INTERVIEW", "OFFER"] }
      }
    });

    const response = NextResponse.json({ 
      applications: totalApplications,
      interviews
    });
    
    // Enable CORS for portfolio
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ applications: 0, interviews: 0 }, { status: 500 });
  }
}
