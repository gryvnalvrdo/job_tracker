import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming this is the correct path for Prisma client

export async function POST(req: Request) {
  try {
    // 1. Verify Secret Key
    const secret = req.headers.get("x-autoapply-secret");
    const expectedSecret = process.env.AUTOAPPLY_SECRET || "my-secret-key";

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { companyName, position, jobUrl, source } = body;

    if (!companyName || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Find Demo User
    const demoEmail = "demo@jobtrail.app";
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    // Fallback if demo user doesn't exist, try to get the first user
    if (!user) {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            user = firstUser;
        } else {
             return NextResponse.json({ error: "No users found in database to assign application to" }, { status: 500 });
        }
    }

    // 4. Create Application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        companyName,
        position,
        jobUrl,
        notes: source ? `Ditambahkan dari: ${source}` : "Ditambahkan dari n8n otomatis",
        status: "SAVED",
        appliedDate: new Date(),
        statusHistory: {
          create: [
            { status: "SAVED" }
          ]
        }
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error("AutoApply API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
