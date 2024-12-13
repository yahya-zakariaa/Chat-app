import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function CheckAuthMiddleware(req: NextRequest) {
  const token = req.cookies.get("token");
  
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile"],
};
