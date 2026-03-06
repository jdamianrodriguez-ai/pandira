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

  // Obtener juegos del usuario
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)

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
        `https://api.rawg.io/api/games/${game.rawg_id}?key=${process.env.RAWG_API_KEY}`
      )

      const data = await res.json()

      let description =
        data.description_raw ||
        data.description?.replace(/<[^>]*>/g, "") ||
        null

      if (description) {
        description = await translateToSpanish(description)
      }

      const year = data.released
        ? parseInt(data.released.split("-")[0])
        : null

      await supabase
        .from("games")
        .update({
          title: game.title || data.name,
          cover: game.cover || data.background_image,
          year: game.year || year
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