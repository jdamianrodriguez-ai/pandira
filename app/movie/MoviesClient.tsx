"use client"

import { useState } from "react"
import CollectionLayout from "@/components/items/CollectionLayout"
import Link from "next/link"
import MovieSearchModal from "@/components/MovieSearchModal"
import AIInsightsPanel from "@/components/AIInsightsPanel"

export default function MoviesClient({ initialMovies }: any) {
  const [items, setItems] = useState(initialMovies || [])
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  async function searchMovie(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return

    setError(null)

    try {
      const res = await fetch(`/api/search-movie?query=${title}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSearchResults(data.results || [])
      setModalOpen(true)
    } catch {
      setError("Error buscando película.")
    }
  }

  async function addSelectedMovie(movie: any) {
    setModalOpen(false)
    setError(null)

    try {
      const res = await fetch(`/api/add-movie`, {
        method: "POST",
        body: JSON.stringify({ tmdbId: movie.tmdb_id }),
      })

      if (!res.ok) {
        setError("Error añadiendo película.")
        return
      }

      window.location.reload()
    } catch {
      setError("Algo ha fallado.")
    }
  }

  return (
    <CollectionLayout background="/backgrounds/movie-texture.png">
      <div className="relative px-10 pt-20 pb-16 text-white">

        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Películas
            </h1>
            <p className="text-gray-400 mt-3 text-sm">
              {items.length} títulos registrados
            </p>
          </div>

          <form onSubmit={searchMovie}>
            <input
              type="text"
              placeholder="Buscar película..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full px-5 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {error && (
          <p className="text-red-400 mb-6 text-sm">{error}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
          {items.map((item: any) => {
            const movie = item.catalog_items
            return (
              <Link
                href={`/movie/${item.catalog_item_id}`}
                key={item.id}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                  {movie?.cover_url && (
                    <img
                      src={movie.cover_url}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-semibold truncate">
                      {movie?.title}
                    </h3>
                    {movie?.year && (
                      <p className="text-xs text-gray-400 mt-1">
                        {movie.year}
                      </p>
                    )}
                  </div>

                </div>
              </Link>
            )
          })}
        </div>

      </div>

      <MovieSearchModal
        open={modalOpen}
        results={searchResults}
        onClose={() => setModalOpen(false)}
        onSelect={addSelectedMovie}
      />

      <AIInsightsPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
      />

    </CollectionLayout>
  )
}