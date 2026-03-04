import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 })
  }

  const supabase = await createServerComponentClient()

  await supabase
    .from("items")
    .delete()
    .eq("id", id)

  return NextResponse.redirect(new URL("/games", req.url))
}