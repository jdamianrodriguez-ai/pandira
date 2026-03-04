"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"

export default function GameDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGame() {
      // 1️⃣ Buscar catalog_item
      const { data: catalogItem } = await supabase
        .from("catalog_items")
        .select("*")
        .eq("id", id)
        .single()

      if (!catalogItem) {
        setLoading(false)
        return
      }

      // 2️⃣ Buscar datos específicos en games usando rawg_id
      const { data: gameData } = await supabase
        .from("games")
        .select("*")
        .eq("rawg_id", parseInt(catalogItem.external_id))
        .maybeSingle()

      setGame({
        ...catalogItem,
        ...gameData,
      })

      setLoading(false)
    }

    if (id) loadGame()
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-20">Cargando...</div>
  }

  if (!game) {
    return <div className="min-h-screen bg-black text-white p-20">No encontrado</div>
  }

  return (
    <div className="min-h-screen bg-black text-white px-16 py-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {game.cover_url && (
          <img
            src={game.cover_url}
            alt={game.title}
            className="w-full max-w-md aspect-[2/3] object-cover rounded-2xl"
          />
        )}

        <div>
          <h1 className="text-5xl font-bold mb-6">
            {game.title}
          </h1>

          {game.year && (
            <p className="text-gray-400 mb-2">
              📅 Año: {game.year}
            </p>
          )}
{game.metacritic && (
  <p className="text-sm text-green-400 mt-1">
    ⭐ Metacritic: {game.metacritic}
  </p>
)}

{game.rating && (
  <p className="text-sm text-purple-400">
    🎮 Rating RAWG: {game.rating.toFixed(1)}
  </p>
)}
          {game.platform && (
            <p className="text-gray-400 mb-2">
              🎮 Plataforma: {game.platform}
            </p>
          )}

          {game.genre && (
            <p className="text-gray-400 mb-2">
              🏷 Géneros: {Array.isArray(game.genre) ? game.genre.join(", ") : game.genre}
            </p>
          )}

          {game.description && (
            <div className="text-gray-300 leading-relaxed whitespace-pre-line mb-10">
              {game.description}
            </div>
          )}

          <button
            onClick={async () => {
              await supabase
                .from("collection_items")
                .delete()
                .eq("catalog_item_id", game.id)

              router.push("/games")
            }}
            className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Eliminar de mi colección
          </button>

        </div>

      </div>
    </div>
  )
}