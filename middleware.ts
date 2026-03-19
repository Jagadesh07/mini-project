import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/utils/rate-limit";

const protectedPrefixes = ["/dashboard", "/api/projects", "/api/tasks", "/api/dashboard", "/api/notifications"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isApiRequest = pathname.startsWith("/api/");

  if (isApiRequest) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous";
    const rateLimit = checkRateLimit(`${ip}:${pathname}`);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Too many requests",
          error: "Rate limit exceeded"
        },
        { status: 429 }
      );
    }
  }

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !request.cookies.get("stm_access")?.value) {
    if (isApiRequest) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Unauthorized",
          error: "Authentication required"
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"]
};
