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

  // Obtener juegos del usuario directamente desde la tabla games
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    console.error("Error cargando juegos:", error)
    return <div>Error cargando videojuegos</div>
  }

  return <GamesClient initialGames={games || []} />
}