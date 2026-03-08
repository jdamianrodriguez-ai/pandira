import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query requerida" }, { status: 400 })
  }

  const apiKey = process.env.RAWG_API_KEY

  const res = await fetch(
    `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=8`
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Error RAWG" }, { status: 400 })
  }

  const data = await res.json()

  const results =
    data.results?.map((game: any) => ({
      id: game.id,
      name: game.name,
      released: game.released || null,
      background_image: game.background_image || null,
    })) || []

  return NextResponse.json({ results })

}