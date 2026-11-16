import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_ORIGINS = new Set([
  "https://portofolio-seven-lac-56.vercel.app",
  "http://localhost:3000",
]);

const MAX_COVER_LETTER_LENGTH = 20000;

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) return origin;
  return "https://portofolio-seven-lac-56.vercel.app";
}

export async function OPTIONS(req: Request) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", getCorsOrigin(req));
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Vary", "Origin");
  return response;
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const corsOrigin = getCorsOrigin(req);

  try {
    const params = await props.params;
    const body = await req.json().catch(() => null);
    const coverLetter = typeof body?.coverLetter === "string" ? body.coverLetter.trim() : "";

    if (!coverLetter || coverLetter.length > MAX_COVER_LETTER_LENGTH) {
      return NextResponse.json(
        { error: "Cover letter must be a non-empty string under 20,000 characters." },
        { status: 400, headers: { "Access-Control-Allow-Origin": corsOrigin } }
      );
    }

    // Prevent IDOR on private user accounts: only demo/public showcase records can be synced via public CoverCraft link
    const target = await prisma.application.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true } } },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": corsOrigin } }
      );
    }

    const allowedPublicEmails = new Set([
      "demo@jobtrail.app",
      process.env.AUTOAPPLY_USER_EMAIL || "gryvnalvrdo@gmail.com",
    ]);

    if (!allowedPublicEmails.has(target.user.email)) {
      return NextResponse.json(
        { error: "Forbidden for private user records" },
        { status: 403, headers: { "Access-Control-Allow-Origin": corsOrigin } }
      );
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: { coverLetter },
    });

    const response = NextResponse.json({ success: true, application });
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);
    response.headers.set("Vary", "Origin");
    return response;
  } catch (error) {
    console.error("Save cover letter error:", error);
    return NextResponse.json(
      { error: "Failed to save cover letter" },
      { status: 500, headers: { "Access-Control-Allow-Origin": corsOrigin } }
    );
  }
}
