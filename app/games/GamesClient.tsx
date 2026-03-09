"use client"

import { useState } from "react"
import CollectionLayout from "@/components/items/CollectionLayout"
import GameSearchModal from "@/components/GameSearchModal"
import ItemGrid from "@/components/items/ItemGrid"

export default function GamesClient({ initialGames }: any) {

  const [items] = useState(initialGames || [])
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

      const rawgId =
        game.rawg_id ||
        game.id ||
        game.gameId

      if (!rawgId) {
        console.error("GAME OBJECT:", game)
        setError("ID de juego inválido.")
        return
      }

      const res = await fetch(`/api/add-game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rawgId
        })
      })

      if (!res.ok) {

        const data = await res.json()
        console.error("ADD GAME ERROR:", data)

        setError("Error añadiendo videojuego.")
        return

      }

      window.location.reload()

    } catch (err) {

      console.error(err)
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

        <ItemGrid
          items={items}
          basePath="games"
        />

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