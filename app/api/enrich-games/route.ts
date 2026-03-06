import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"

export async function POST() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!games) {
    return NextResponse.json({ success: true, updated: 0 })
  }

  let updated = 0

  for (const game of games) {

    if (game.title && game.cover) continue

    try {

      const res = await fetch(
        `https://api.rawg.io/api/games/${game.rawg_id}?key=${process.env.RAWG_API_KEY}`
      )

      const data = await res.json()

      await supabase
        .from("games")
        .update({
          title: data.name,
          cover: data.background_image,
          year: data.released ? parseInt(data.released.split("-")[0]) : null
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