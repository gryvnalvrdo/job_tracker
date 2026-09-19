import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { coverLetter } = body;

    if (!coverLetter) {
      return NextResponse.json({ error: "Missing cover letter" }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: { coverLetter },
    });

    const response = NextResponse.json({ success: true, application });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Save cover letter error:", error);
    return NextResponse.json({ error: "Failed to save cover letter" }, { status: 500 });
  }
}
