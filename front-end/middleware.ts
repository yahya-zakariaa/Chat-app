import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  if (
    !token &&
    req.nextUrl.pathname != "/login" &&
    req.nextUrl.pathname != "/signup" &&
    req.nextUrl.pathname != "/forgot-password"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    (token && req.nextUrl.pathname == "/login") ||
    req.nextUrl.pathname == "/signup" ||
    req.nextUrl.pathname == "/forgot-password"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/login", "signup", "forgot-password"],
};
