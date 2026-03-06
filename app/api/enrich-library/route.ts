import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {

    const { data: movies, error } = await supabase
      .from("movies")
      .select("*")

    if (error) throw error

    const apiKey = process.env.TMDB_API_KEY

    for (const movie of movies || []) {

      if (!movie.tmdb_id) continue

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.tmdb_id}?api_key=${apiKey}&language=es-ES`
      )

      const data = await res.json()

      if (!data) continue

      await supabase
        .from("movies")
        .update({
          title: data.title,
          overview: data.overview,
          poster: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : null,
          year: data.release_date
            ? parseInt(data.release_date.substring(0,4))
            : null
        })
        .eq("id", movie.id)

      console.log("Updated:", data.title)

    }

    return NextResponse.json({ success: true })

  } catch (err: any) {

    console.error(err)

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )

  }
}