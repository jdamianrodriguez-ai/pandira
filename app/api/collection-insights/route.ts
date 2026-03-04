import { createServerComponentClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createServerComponentClient()

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("type", "movie")

  if (!items || items.length === 0) {
    return NextResponse.json({
      message: "Tu colección está vacía."
    })
  }

  const totalMovies = items.length

  // 📊 Década dominante
  const decadeCount: Record<string, number> = {}

  items.forEach(item => {
    if (item.year) {
      const decade = Math.floor(item.year / 10) * 10
      decadeCount[decade] = (decadeCount[decade] || 0) + 1
    }
  })

  const dominantDecade = Object.entries(decadeCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  // 🎭 Género dominante
  const genreCount: Record<string, number> = {}

  items.forEach(item => {
    if (item.genre && Array.isArray(item.genre)) {
      item.genre.forEach((g: string) => {
        genreCount[g] = (genreCount[g] || 0) + 1
      })
    }
  })

  const topGenre = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  // 🎬 Director dominante
  const directorCount: Record<string, number> = {}

  items.forEach(item => {
    if (item.director) {
      directorCount[item.director] =
        (directorCount[item.director] || 0) + 1
    }
  })

  const topDirector = Object.entries(directorCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  // 🎭 Actor dominante
  const actorCount: Record<string, number> = {}

  items.forEach(item => {
    if (item.actors && Array.isArray(item.actors)) {
      item.actors.forEach((actor: string) => {
        actorCount[actor] = (actorCount[actor] || 0) + 1
      })
    }
  })

  const topActor = Object.entries(actorCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  // ⏳ Película más larga
  const longestMovie = items
    .filter(i => i.runtime)
    .sort((a, b) => b.runtime - a.runtime)[0]?.title

  // 📏 Duración media
  const runtimeMovies = items.filter(i => i.runtime)
  const averageRuntime =
    runtimeMovies.length > 0
      ? Math.round(
          runtimeMovies.reduce((sum, m) => sum + m.runtime, 0) /
            runtimeMovies.length
        )
      : null

  return NextResponse.json({
    totalMovies,
    dominantDecade,
    topGenre,
    topDirector,
    topActor,
    longestMovie,
    averageRuntime,
    allMovies: items
  })
}