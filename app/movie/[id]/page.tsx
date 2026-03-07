"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"

export default function MovieDetailPage() {

  const supabase = createClient()

  const { id } = useParams()
  const router = useRouter()

  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadMovie() {

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

      // 2️⃣ Buscar datos específicos en movies usando tmdb_id
      const { data: movieData } = await supabase
        .from("movies")
        .select("*")
        .eq("tmdb_id", parseInt(catalogItem.external_id))
        .maybeSingle()

      setMovie({
        ...catalogItem,
        ...movieData,
      })

      setLoading(false)

    }

    if (id) loadMovie()

  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-20">
        Cargando...
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white p-20">
        No encontrado
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-16 py-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {movie.cover_url && (
          <img
            src={movie.cover_url}
            alt={movie.title}
            className="w-full max-w-md aspect-[2/3] object-cover rounded-2xl"
          />
        )}

        <div>

          <h1 className="text-5xl font-bold mb-6">
            {movie.title}
          </h1>

          {movie.year && (
            <p className="text-gray-400 mb-2">
              📅 Año: {movie.year}
            </p>
          )}

          {movie.runtime && (
            <p className="text-gray-400 mb-2">
              ⏱ Duración: {movie.runtime} min
            </p>
          )}

          {movie.vote_average && (
            <p className="text-gray-400 mb-2">
              ⭐ Nota TMDB: {movie.vote_average}
            </p>
          )}

          {movie.director && (
            <p className="text-gray-400 mb-2">
              🎬 Director: {movie.director}
            </p>
          )}

          {movie.genre && (
            <p className="text-gray-400 mb-2">
              🏷 Géneros: {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
            </p>
          )}

          {movie.actors && (
            <p className="text-gray-400 mb-6">
              🎭 Actores: {Array.isArray(movie.actors) ? movie.actors.join(", ") : movie.actors}
            </p>
          )}

          {movie.description && (
            <div className="text-gray-300 leading-relaxed whitespace-pre-line mb-10">
              {movie.description}
            </div>
          )}

          <button
            onClick={async () => {

              await supabase
                .from("collection_items")
                .delete()
                .eq("catalog_item_id", movie.id)

              router.push("/movie")

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