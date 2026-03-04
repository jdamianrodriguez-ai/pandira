import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 })
  }

  const apiKey = process.env.RAWG_API_KEY

  const res = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${apiKey}`
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Error RAWG" }, { status: 400 })
  }

  const game = await res.json()

  return NextResponse.json({
    rawg_id: game.id,
    title: game.name,
    year: game.released ? game.released.split("-")[0] : null,
    description: game.description_raw || null,
    cover_url: game.background_image || null,
    genres: game.genres?.map((g: any) => g.name) || [],
    rating: game.rating || null,
    platforms:
      game.platforms?.map((p: any) => p.platform.name).join(", ") || null,
  })
}