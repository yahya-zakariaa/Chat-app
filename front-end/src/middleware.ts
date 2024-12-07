import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useAuthStore } from "@/store/useAuthStore.js";

export function clientSideCheckAuth(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export async function serverSideCheckAuth(req: NextRequest) {
  const { checkAuth } = useAuthStore();

  const res = await checkAuth();
  if (res.status == 401) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/profile"],
};
