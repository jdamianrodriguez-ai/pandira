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

  const { rawgId } = await req.json()

  if (!rawgId) {
    return NextResponse.json({ error: "Falta rawgId" }, { status: 400 })
  }

  try {
    const detailsRes = await fetch(
      `http://localhost:3000/api/get-game-details?id=${rawgId}`
    )

    if (!detailsRes.ok) {
      return NextResponse.json(
        { error: "Error obteniendo detalles" },
        { status: 500 }
      )
    }

    const fullData = await detailsRes.json()

    // 🔎 1️⃣ Buscar o crear catalog_item
    let { data: catalogItem } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("external_id", rawgId.toString())
      .eq("external_source", "rawg")
      .maybeSingle()

    if (!catalogItem) {
      const { data, error } = await supabase
        .from("catalog_items")
        .insert({
          type: "game",
          title: fullData.title,
          original_title: fullData.title,
          year: fullData.year ? parseInt(fullData.year) : null,
          description: fullData.description,
          cover_url: fullData.cover_url,
          backdrop_url: fullData.backdrop_url,
          external_id: rawgId.toString(),
          external_source: "rawg",
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      catalogItem = data
    }

    // 🎮 2️⃣ Crear o asegurar registro en games
    const { data: existingGame } = await supabase
      .from("games")
      .select("*")
      .eq("rawg_id", rawgId)
      .maybeSingle()

    if (!existingGame) {
      const { error: gameError } = await supabase
        .from("games")
        .insert({
          rawg_id: rawgId,
          platform: fullData.platforms || null,
          genre: fullData.genres || null,
        })

      if (gameError) {
        return NextResponse.json(
          { error: gameError.message },
          { status: 500 }
        )
      }
    }

    // 📚 3️⃣ Añadir a colección
    const { data: existingCollection } = await supabase
      .from("collection_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("catalog_item_id", catalogItem.id)
      .maybeSingle()

    if (!existingCollection) {
      const { error: collectionError } = await supabase
        .from("collection_items")
        .insert({
          user_id: user.id,
          catalog_item_id: catalogItem.id,
          status: "owned",
        })

      if (collectionError) {
        return NextResponse.json(
          { error: collectionError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error inesperado" },
      { status: 500 }
    )
  }
}