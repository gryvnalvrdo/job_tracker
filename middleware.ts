import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Authentication redirects are now handled natively by Server Components
  // in app/(dashboard)/layout.tsx and app/(auth)/layout.tsx
  // This prevents NextAuth v5 Edge runtime cookie naming bugs on Vercel.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).+)"],
};
