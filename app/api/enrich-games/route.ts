import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {

  const { data: games } = await supabase
    .from("games")
    .select("*")

  let updated = 0

  for (const game of games) {

    try {

      let data

      // intento directo por ID
      const res = await fetch(
        `https://api.rawg.io/api/games/${game.rawg_id}?key=${process.env.RAWG_API_KEY}`
      )

      data = await res.json()

      // si RAWG no encuentra el juego
      if (data?.detail) {

        const search = await fetch(
          `https://api.rawg.io/api/games?search=${encodeURIComponent(game.title ?? "")}&key=${process.env.RAWG_API_KEY}`
        )

        const searchData = await search.json()

        if (searchData.results?.length) {
          data = searchData.results[0]
        } else {
          continue
        }

      }

      const year = data.released
        ? parseInt(data.released.split("-")[0])
        : null

      const cover =
        data.background_image ||
        data.background_image_additional ||
        null

      await supabase
        .from("games")
        .update({
          title: data.name,
          cover: cover,
          year: year
        })
        .eq("id", game.id)

      updated++

    } catch (err) {

      console.log("Error enriqueciendo:", game.rawg_id)

    }

  }

  return NextResponse.json({
    success: true,
    updated
  })
}