import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  // Kung walang login cookie, balik sa login page
  if (!req.cookies.get("nexus_auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};