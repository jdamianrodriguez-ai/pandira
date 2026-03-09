import { createServerComponentClient } from "@/lib/supabase/server"
import GamesClient from "./GamesClient"

export default async function GamesPage() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>No autenticado</div>
  }

  // Obtener colecciones del usuario
  const { data: collections } = await supabase
    .from("collections")
    .select("id")
    .eq("user_id", user.id)

  if (!collections || collections.length === 0) {
    return <GamesClient initialGames={[]} />
  }

  const collectionIds = collections.map((c) => c.id)

  // Obtener items de esas colecciones
  const { data: items, error: itemsError } = await supabase
    .from("collection_items")
    .select("catalog_item_id")
    .in("collection_id", collectionIds)

  if (itemsError) {
    console.error("Error cargando collection_items:", itemsError)
    return <div>Error cargando videojuegos</div>
  }

  const gameIds = items.map((item) => item.catalog_item_id)

  if (gameIds.length === 0) {
    return <GamesClient initialGames={[]} />
  }

  // Obtener juegos
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .in("id", gameIds)

  if (error) {
    console.error("Error cargando juegos:", error)
    return <div>Error cargando videojuegos</div>
  }

  return <GamesClient initialGames={games || []} />
}