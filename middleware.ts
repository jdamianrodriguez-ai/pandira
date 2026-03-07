import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname

  const publicRoutes = [
    "/login",
    "/signup",
    "/auth",
  ]

  // permitir archivos internos de next
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

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
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}