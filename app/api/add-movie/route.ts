import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { tmdbId } = await req.json()

  if (!tmdbId) {
    return NextResponse.json({ error: "Falta tmdbId" }, { status: 400 })
  }

  try {
    const detailsRes = await fetch(
      `http://localhost:3000/api/get-movie-details?id=${tmdbId}`
    )

    const fullData = await detailsRes.json()

    // 1️⃣ Buscar o crear catalog_item
    let { data: catalogItem } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("external_id", tmdbId.toString())
      .eq("external_source", "tmdb")
      .maybeSingle()

    if (!catalogItem) {
      const { data, error } = await supabase
        .from("catalog_items")
        .insert({
          type: "movie",
          title: fullData.title,
          original_title: fullData.original_title,
          year: fullData.year ? parseInt(fullData.year) : null,
          description: fullData.overview,
          cover_url: fullData.poster,
          backdrop_url: fullData.backdrop_url,
          external_id: tmdbId.toString(),
          external_source: "tmdb",
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      catalogItem = data
    }

    // 2️⃣ Crear o asegurar registro en movies
    const { data: existingMovie } = await supabase
      .from("movies")
      .select("*")
      .eq("tmdb_id", tmdbId)
      .maybeSingle()

    if (!existingMovie) {
      await supabase.from("movies").insert({
        tmdb_id: tmdbId,
        runtime: fullData.runtime || null,
        vote_average: fullData.vote_average || null,
        genre: fullData.genres || null,
        director: fullData.director || null,
        actors: fullData.actors || null,
      })
    }

    // 3️⃣ Añadir a colección
    const { data: existingCollection } = await supabase
      .from("collection_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("catalog_item_id", catalogItem.id)
      .maybeSingle()

    if (!existingCollection) {
      await supabase.from("collection_items").insert({
        user_id: user.id,
        catalog_item_id: catalogItem.id,
        status: "owned",
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error inesperado" },
      { status: 500 }
    )
  }
}