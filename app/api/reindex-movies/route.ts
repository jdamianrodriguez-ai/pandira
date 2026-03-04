import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createServerComponentClient()

  const { data: movies } = await supabase
    .from("items")
    .select("*")
    .eq("type", "movie")
    .is("backdrop_url", null)

  if (!movies || movies.length === 0) {
    return NextResponse.json({ message: "No movies to fix" })
  }

  let fixed = 0

  for (const movie of movies) {
    try {
      console.log("Buscando:", movie.title)

      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(movie.title)}`
      )

      const searchData = await searchRes.json()

      if (!searchData.results?.length) {
        console.log("Sin resultados:", movie.title)
        continue
      }

      // 🔥 Filtrar solo los que tengan backdrop
      const candidates = searchData.results
        .filter((r: any) => r.backdrop_path)
        .sort((a: any, b: any) => b.popularity - a.popularity)

      if (!candidates.length) {
        console.log("Ninguno con backdrop:", movie.title)
        continue
      }

      const best = candidates[0]

      const backdrop_url = `https://image.tmdb.org/t/p/original${best.backdrop_path}`

      await supabase
        .from("items")
        .update({
          tmdb_id: best.id,
          backdrop_url,
        })
        .eq("id", movie.id)

      console.log("ARREGLADA:", movie.title)
      fixed++
    } catch (e) {
      console.log("Error con:", movie.title)
    }
  }

  return NextResponse.json({ fixed })
}