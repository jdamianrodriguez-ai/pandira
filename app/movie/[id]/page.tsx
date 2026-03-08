"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams } from "next/navigation"
import Image from "next/image"

type MovieData = {
  id: string
  title?: string
  year?: number
  runtime?: number
  vote_average?: number
  director?: string
  genre?: string[] | string
  actors?: string[] | string
  description?: string
  cover_url?: string
}

export default function MovieDetailPage() {

  const supabase = createClient()
  const { id } = useParams()

  const [movie, setMovie] = useState<MovieData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadMovie() {

      const { data: catalogItem } = await supabase
        .from("catalog_items")
        .select("*")
        .eq("id", id)
        .single()

      if (!catalogItem) {
        setLoading(false)
        return
      }

      const { data: movieData } = await supabase
        .from("movies")
        .select("*")
        .eq("id", catalogItem.id)
        .maybeSingle()

      setMovie({
        ...catalogItem,
        ...movieData,
      })

      setLoading(false)

    }

    if (id) loadMovie()

  }, [id])

  async function handleDelete() {

    if (!movie) return

    // eliminar de colección
    await supabase
      .from("collection_items")
      .delete()
      .eq("catalog_item_id", movie.id)

    // eliminar datos específicos de película
    await supabase
      .from("movies")
      .delete()
      .eq("id", movie.id)

    // eliminar del catálogo
    await supabase
      .from("catalog_items")
      .delete()
      .eq("id", movie.id)

    // recargar completamente para actualizar contadores
    window.location.href = "/movie"

  }

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
          <Image
            src={movie.cover_url}
            alt={movie.title || "Poster"}
            width={400}
            height={600}
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
              🏷 Géneros: {Array.isArray(movie.genre)
                ? movie.genre.join(", ")
                : movie.genre}
            </p>
          )}

          {movie.actors && (
            <p className="text-gray-400 mb-6">
              🎭 Actores: {Array.isArray(movie.actors)
                ? movie.actors.join(", ")
                : movie.actors}
            </p>
          )}

          {movie.description && (
            <div className="text-gray-300 leading-relaxed whitespace-pre-line mb-10">
              {movie.description}
            </div>
          )}

          <button
            onClick={handleDelete}
            className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Eliminar de mi colección
          </button>

        </div>

      </div>

    </div>
  )
}