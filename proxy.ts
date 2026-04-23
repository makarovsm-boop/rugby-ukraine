import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessAdminPath, getDefaultAdminHref } from "@/lib/roles";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  const role = typeof token.role === "string" ? token.role : null;

  if (!canAccessAdminPath(role, request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(getDefaultAdminHref(role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
