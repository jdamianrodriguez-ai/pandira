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

  const { searchParams } = new URL(req.url)
  const gameId = searchParams.get("id")

  if (!gameId) {
    return NextResponse.json(
      { error: "ID requerido" },
      { status: 400 }
    )
  }

  try {

    // 1️⃣ obtener el catalog_item_id a partir del id de la tabla games
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id")
      .eq("id", gameId)
      .maybeSingle()

    if (gameError) throw gameError

    if (!game) {
      return NextResponse.json(
        { error: "Juego no encontrado" },
        { status: 404 }
      )
    }

    const catalogItemId = game.id

    // 2️⃣ obtener la colección del usuario
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", user.id)
      .eq("name", "Mi colección")
      .maybeSingle()

    if (collectionError) throw collectionError

    if (!collection) {
      return NextResponse.json(
        { error: "Colección no encontrada" },
        { status: 404 }
      )
    }

    // 3️⃣ eliminar de collection_items
    const { error: deleteError } = await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", collection.id)
      .eq("catalog_item_id", catalogItemId)

    if (deleteError) throw deleteError

    // 4️⃣ redirigir a la página de juegos
    return NextResponse.redirect(new URL("/games", req.url))

  } catch (err: any) {

    console.error("DELETE GAME ERROR:", err)

    return NextResponse.json(
      { error: err.message || "Error eliminando juego" },
      { status: 500 }
    )

  }
}