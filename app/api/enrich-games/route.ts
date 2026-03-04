import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"

async function translateToSpanish(text: string) {

  try {

    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`
    )

    const data = await res.json()

    if (!data || !data[0]) return text

    return data[0].map((t: any) => t[0]).join("")

  } catch {

    return text

  }

}

export async function POST() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: games, error } = await supabase
    .from("catalog_items")
    .select("*")
    .eq("type", "game")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!games?.length) {
    return NextResponse.json({ success: true, updated: 0 })
  }

  let updated = 0

  for (const game of games) {

    try {

      const res = await fetch(
        `https://api.rawg.io/api/games/${game.external_id}?key=${process.env.RAWG_API_KEY}`
      )

      const data = await res.json()

      let description =
        data.description_raw ||
        data.description?.replace(/<[^>]*>/g, "") ||
        game.description ||
        null

      if (description) {
        description = await translateToSpanish(description)
      }

      await supabase
        .from("catalog_items")
        .update({
          description: description,
          cover_url: game.cover_url || data.background_image,
          metacritic: data.metacritic ?? game.metacritic,
          rating: data.rating ?? game.rating
        })
        .eq("id", game.id)

      updated++

    } catch (err) {

      console.log("Error enriqueciendo:", game.title)

    }

  }

  return NextResponse.json({
    success: true,
    updated
  })
}