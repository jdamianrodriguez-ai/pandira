import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"

export async function POST(req: Request) {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    )
  }

  try {

    const body = await req.json()

    console.log("BODY RECEIVED:", body)

    const rawgId =
      body.rawgId ||
      body.id ||
      body.gameId

    if (!rawgId) {
      return NextResponse.json(
        { error: "rawgId no recibido", body },
        { status: 400 }
      )
    }

    const url = new URL(req.url)

    const detailsRes = await fetch(
      `${url.origin}/api/get-game-details?id=${rawgId}`
    )

    if (!detailsRes.ok) {
      throw new Error("Error obteniendo datos de RAWG")
    }

    const gameData = await detailsRes.json()

    console.log("GAME DATA:", gameData)

    // 1️⃣ catalog_items

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
          title: gameData.title,
          year: gameData.year,
          description: gameData.description,
          cover_url: gameData.cover_url,
          external_id: rawgId.toString(),
          external_source: "rawg",
        })
        .select()
        .single()

      if (error) throw error

      catalogItem = data

    }

    // 2️⃣ games (tabla de datos específicos del videojuego)

    const { data: existingGame } = await supabase
      .from("games")
      .select("*")
      .eq("id", catalogItem.id)
      .maybeSingle()

    if (!existingGame) {

      const { error } = await supabase
        .from("games")
        .insert({
          id: catalogItem.id,
          rawg_id: rawgId,
          title: gameData.title,
          cover: gameData.cover_url,
          year: gameData.year,
          metacritic: gameData.metacritic || null,
          genre: gameData.genres || null,
          platform: gameData.platforms || null
        })

      if (error) throw error

    }

    // 3️⃣ colección principal del usuario

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

    // 4️⃣ collection_items (relación usuario ↔ juego)

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

    console.error("ADD GAME ERROR:", err)

    return NextResponse.json(
      {
        error: err.message || "Error inesperado",
        details: err
      },
      { status: 500 }
    )

  }

}