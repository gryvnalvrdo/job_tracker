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
    let { companyName, position, jobUrl, source } = body;

    if (!companyName || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // FIX for n8n sending "Company" and combined title from WWR
    if (companyName === "Company" && position.includes(":")) {
      const parts = position.split(":");
      companyName = parts[0].trim();
      position = parts.slice(1).join(":").trim();
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

    // 3.5 Check for Duplicates in BOTH Application and ProcessedJob
    const duplicateCondition = {
      OR: [
        { jobUrl: jobUrl ? jobUrl : undefined },
        {
          AND: [
            { companyName: { equals: companyName, mode: "insensitive" as const } },
            { position: { equals: position, mode: "insensitive" as const } }
          ]
        }
      ]
    };

    const [existingApp, existingProcessed] = await Promise.all([
      prisma.application.findFirst({
        where: {
          userId: user.id,
          ...duplicateCondition
        }
      }),
      prisma.processedJob.findFirst({
        where: duplicateCondition
      })
    ]);

    if (existingApp || existingProcessed) {
      // If it exists in Application but NOT in ProcessedJob (old data), let's backfill it so it stays there if deleted
      if (existingApp && !existingProcessed) {
        await prisma.processedJob.create({
          data: {
            companyName: existingApp.companyName,
            position: existingApp.position,
            jobUrl: existingApp.jobUrl,
            source: source || null,
          }
        }).catch(() => {}); // ignore duplicate key errors if any
      }

      // Return 200 OK so n8n doesn't error, but include a message that it was skipped
      return NextResponse.json({ success: true, skipped: true, message: "Duplicate job detected" }, { status: 200 });
    }

    // 4. Create Application and ProcessedJob history
    const [application] = await prisma.$transaction([
      prisma.application.create({
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
      }),
      prisma.processedJob.create({
        data: {
          companyName,
          position,
          jobUrl,
          source: source || null,
        }
      })
    ]);

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error("AutoApply API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
