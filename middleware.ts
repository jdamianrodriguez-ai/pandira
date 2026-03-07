import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {

  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // rutas públicas
  const publicRoutes = ["/login", "/signup"]

  if (!session && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
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