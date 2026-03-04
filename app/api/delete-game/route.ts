import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 })
  }

  return NextResponse.redirect(new URL("/games", req.url))
}