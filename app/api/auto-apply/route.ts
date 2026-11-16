import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

function safeSecretEqual(provided: string, expected: string): boolean {
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(providedBuf, expectedBuf);
}

function sanitizeHttpUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString().slice(0, 2048);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const expectedSecret = process.env.AUTOAPPLY_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { error: "Webhook ingestion secret is not configured" },
        { status: 503 }
      );
    }

    const secret = req.headers.get("x-autoapply-secret") || "";
    if (!secret || !safeSecretEqual(secret, expectedSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    let companyName = typeof body.companyName === "string" ? body.companyName.trim().slice(0, 160) : "";
    let position = typeof body.position === "string" ? body.position.trim().slice(0, 200) : "";
    const jobUrl = sanitizeHttpUrl(body.jobUrl);
    const source = typeof body.source === "string" ? body.source.trim().slice(0, 100) : "";

    if (!companyName || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Normalize WWR combined title format
    if (companyName === "Company" && position.includes(":")) {
      const parts = position.split(":");
      companyName = parts[0].trim().slice(0, 160);
      position = parts.slice(1).join(":").trim().slice(0, 200);
    }

    const ownerEmail = process.env.AUTOAPPLY_USER_EMAIL || "gryvnalvrdo@gmail.com";
    const user = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Configured owner account was not found." },
        { status: 500 }
      );
    }

    const duplicateCondition = {
      OR: [
        ...(jobUrl ? [{ jobUrl }] : []),
        {
          AND: [
            { companyName: { equals: companyName, mode: "insensitive" as const } },
            { position: { equals: position, mode: "insensitive" as const } },
          ],
        },
      ],
    };

    const [existingApp, existingProcessed] = await Promise.all([
      prisma.application.findFirst({
        where: {
          userId: user.id,
          ...duplicateCondition,
        },
      }),
      prisma.processedJob.findFirst({
        where: duplicateCondition,
      }),
    ]);

    if (existingApp || existingProcessed) {
      if (existingApp && !existingProcessed) {
        await prisma.processedJob
          .create({
            data: {
              companyName: existingApp.companyName,
              position: existingApp.position,
              jobUrl: existingApp.jobUrl,
              source: source || null,
            },
          })
          .catch(() => {});
      }

      return NextResponse.json(
        { success: true, skipped: true, message: "Duplicate job detected" },
        { status: 200 }
      );
    }

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
            create: [{ status: "SAVED" }],
          },
        },
      }),
      prisma.processedJob.create({
        data: {
          companyName,
          position,
          jobUrl,
          source: source || null,
        },
      }),
    ]);

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error("AutoApply API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
