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

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)

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

      await supabase
        .from("games")
        .update({
          title: data.name,
          cover: data.background_image,
          year: data.released
        })
        .eq("id", game.id)

      updated++

    } catch (err) {
      console.log("Error RAWG:", game.rawg_id)
    }

  }

  return NextResponse.json({
    success: true,
    updated
  })

}