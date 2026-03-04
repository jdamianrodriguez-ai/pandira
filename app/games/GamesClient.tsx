"use client"

import { useState } from "react"
import CollectionLayout from "@/components/items/CollectionLayout"
import GameSearchModal from "@/components/GameSearchModal"
import Link from "next/link"

export default function GamesClient({ initialGames }: any) {
  const [items, setItems] = useState(initialGames || [])
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingEnrich, setLoadingEnrich] = useState(false)

  async function searchGame(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return

    setError(null)

    try {
      const res = await fetch(`/api/search-game?query=${title}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSearchResults(data.results || [])
      setModalOpen(true)
    } catch {
      setError("Error buscando videojuego.")
    }
  }

  async function addSelectedGame(game: any) {
    setModalOpen(false)
    setError(null)

    try {
      const res = await fetch(`/api/add-game`, {
        method: "POST",
        body: JSON.stringify({ rawgId: game.id }),
      })

      if (!res.ok) {
        setError("Error añadiendo videojuego.")
        return
      }

      window.location.reload()
    } catch {
      setError("Algo ha fallado.")
    }
  }

  async function enrichGames() {
    try {
      setLoadingEnrich(true)

      const res = await fetch("/api/enrich-games", {
        method: "POST"
      })

      const data = await res.json()

      alert(`Datos completados para ${data.updated} juegos`)

      window.location.reload()

    } catch {
      alert("Error enriqueciendo juegos")
    }

    setLoadingEnrich(false)
  }

  function getMetacriticColor(score: number) {
    if (score >= 90) return "bg-green-600"
    if (score >= 75) return "bg-yellow-500"
    return "bg-red-600"
  }

  return (
    <CollectionLayout background="/backgrounds/game-texture.png">
      <div className="relative px-10 pt-20 pb-16 text-white">

        <div className="flex items-center justify-between mb-16">
          <div>

            <h1 className="text-5xl font-bold tracking-tight">
              Videojuegos
            </h1>

            <p className="text-gray-400 mt-3 text-sm">
              {items.length} títulos registrados
            </p>

            <button
              onClick={enrichGames}
              disabled={loadingEnrich}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {loadingEnrich
                ? "Actualizando datos..."
                : "✨ Completar datos de colección"}
            </button>

          </div>

          <form onSubmit={searchGame}>
            <input
              type="text"
              placeholder="Buscar videojuego..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full px-5 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </form>
        </div>

        {error && (
          <p className="text-red-400 mb-6 text-sm">{error}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">

          {items.map((item: any) => {

            const game = item.catalog_items

            return (
              <Link
                href={`/games/${item.catalog_item_id}`}
                key={item.id}
                className="group"
              >

                <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                  {game?.cover_url && (
                    <img
                      src={game.cover_url}
                      alt={game.title}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}

                  {/* METACRITIC BADGE */}
                  {game?.metacritic && (
                    <div
                      className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded-md shadow ${getMetacriticColor(
                        game.metacritic
                      )}`}
                    >
                      ⭐ {game.metacritic}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">

                    <h3 className="text-sm font-semibold truncate">
                      {game?.title}
                    </h3>

                    {game?.year && (
                      <p className="text-xs text-gray-400 mt-1">
                        {game.year}
                      </p>
                    )}

                  </div>

                </div>

              </Link>
            )

          })}

        </div>

      </div>

      <GameSearchModal
        open={modalOpen}
        results={searchResults}
        onClose={() => setModalOpen(false)}
        onSelect={addSelectedGame}
      />

    </CollectionLayout>
  )
}