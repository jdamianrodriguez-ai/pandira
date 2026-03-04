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
      message: "Tu colección está vacía. Esto es preocupante."
    })
  }

  // 📊 Calcular década dominante
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
    if (item.genre) {
      item.genre.split(",").forEach((g: string) => {
        const genre = g.trim()
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    }
  })

  const dominantGenre = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  // ⏳ Pendientes
  const pendingCount = items.filter(i => i.status === "pending").length

  // 🎯 Recomendación simple (random pendiente o random total)
  const recommendationPool =
    items.filter(i => i.status === "pending").length > 0
      ? items.filter(i => i.status === "pending")
      : items

  const recommendation =
    recommendationPool[Math.floor(Math.random() * recommendationPool.length)]

  return NextResponse.json({
    dominantDecade,
    dominantGenre,
    pendingCount,
    recommendation: recommendation?.title
  })
}