import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname

  const publicRoutes = ["/login", "/signup"]

  const hasAuthCookie =
    request.cookies.get("sb-access-token") ||
    request.cookies.get("sb-refresh-token")

  if (!hasAuthCookie && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/movie/:path*",
    "/games/:path*",
    "/books/:path*",
    "/comics/:path*",
  ],
}