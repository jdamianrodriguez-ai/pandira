"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

export default function GameDetailPage() {

  const supabase = createClient()

  const { id } = useParams()
  const router = useRouter()

  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadGame() {

      // catalog item (datos globales)
      const { data: catalogItem } = await supabase
        .from("catalog_items")
        .select("*")
        .eq("id", id)
        .single()

      // datos del usuario
      const { data: gameData } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .maybeSingle()

      if (!catalogItem) {
        setLoading(false)
        return
      }

      setGame({
        ...catalogItem,
        ...gameData
      })

      setLoading(false)

    }

    if (id) loadGame()

  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-20">
        Cargando...
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black text-white p-20">
        No encontrado
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-16 py-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {(game.cover || game.cover_url) && (
          <Image
            src={game.cover || game.cover_url}
            alt={game.title}
            width={400}
            height={600}
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

          {game.metacritic && (
            <p className="text-green-400 mb-4">
              ⭐ Metacritic: {game.metacritic}
            </p>
          )}

          {game.description && (
            <p className="text-gray-300 leading-relaxed mt-6">
              {game.description}
            </p>
          )}

          <button
            onClick={async () => {

              await supabase
                .from("games")
                .delete()
                .eq("id", id)

              router.push("/games")

            }}
            className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition mt-8"
          >
            Eliminar de mi colección
          </button>

        </div>

      </div>

    </div>
  )
}