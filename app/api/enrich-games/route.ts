import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {

  const { data: games, error } = await supabase
    .from("games")
    .select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!games) {
    return NextResponse.json({ success: true, updated: 0 })
  }

  let updated = 0

  for (const game of games) {

    try {

      const res = await fetch(
        `https://api.rawg.io/api/games/${game.rawg_id}?key=${process.env.RAWG_API_KEY}`
      )

      const data = await res.json()

      const year = data.released
        ? parseInt(data.released.split("-")[0])
        : game.year

      const newCover =
        data.background_image ||
        data.background_image_additional ||
        game.cover

      const newTitle =
        data.name ||
        game.title ||
        "Videojuego"

      await supabase
        .from("games")
        .update({
          title: newTitle,
          cover: newCover,
          year: year
        })
        .eq("id", game.id)

      updated++

    } catch {

      console.log("Error enriqueciendo:", game.rawg_id)

    }

  }

  return NextResponse.json({
    success: true,
    updated
  })
}