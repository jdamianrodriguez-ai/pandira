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

  try {

    const { tmdbId, format } = await req.json()

    if (!tmdbId) {
      return NextResponse.json({ error: "Falta tmdbId" }, { status: 400 })
    }

    const url = new URL(req.url)

    const detailsRes = await fetch(
      `${url.origin}/api/get-movie-details?id=${tmdbId}`
    )

    if (!detailsRes.ok) {
      throw new Error("Error obteniendo datos de la película")
    }

    const fullData = await detailsRes.json()

    // 1️⃣ catalog_items
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

      if (error) throw error

      catalogItem = data
    }

    // 2️⃣ movies
    const { data: existingMovie } = await supabase
      .from("movies")
      .select("*")
      .eq("id", catalogItem.id)
      .maybeSingle()

    if (!existingMovie) {

      const { error } = await supabase
        .from("movies")
        .insert({
          id: catalogItem.id,
          tmdb_id: tmdbId,
          poster: fullData.poster,
          runtime: fullData.runtime || null,
          vote_average: fullData.vote_average || null,
          genre: fullData.genres || null,
          director: fullData.director || null,
          actors: fullData.actors || null,
          format: format || null
        })

      if (error) throw error

    }

    // 3️⃣ colección principal
    let { data: collection } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", user.id)
      .eq("name", "Mi colección")
      .maybeSingle()

    if (!collection) {

      const { data, error } = await supabase
        .from("collections")
        .insert({
          name: "Mi colección",
          type: "manual",
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      collection = data
    }

    // 4️⃣ añadir a colección
    const { data: existingItem } = await supabase
      .from("collection_items")
      .select("*")
      .eq("collection_id", collection.id)
      .eq("catalog_item_id", catalogItem.id)
      .maybeSingle()

    if (!existingItem) {

      const { error } = await supabase
        .from("collection_items")
        .insert({
          collection_id: collection.id,
          catalog_item_id: catalogItem.id,
          status: "owned",
        })

      if (error) throw error

    }

    return NextResponse.json({ success: true })

  } catch (err: any) {

    console.error("ADD MOVIE ERROR:", err)

    return NextResponse.json(
      { error: err.message || "Error inesperado" },
      { status: 500 }
    )

  }

}