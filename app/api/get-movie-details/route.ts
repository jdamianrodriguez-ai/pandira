import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 })
  }

  const apiKey = process.env.TMDB_API_KEY

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-ES&append_to_response=credits`
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Error TMDB" }, { status: 400 })
  }

  const movie = await res.json()

  const director =
    movie.credits?.crew?.find((p: any) => p.job === "Director")?.name || null

  const actors =
    movie.credits?.cast?.slice(0, 5).map((a: any) => a.name) || []

  return NextResponse.json({
    tmdb_id: movie.id,
    title: movie.title,
    original_title: movie.original_title,
    year: movie.release_date ? movie.release_date.split("-")[0] : null,
    overview: movie.overview || null,
    runtime: movie.runtime || null,
    vote_average: movie.vote_average || null,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    backdrop_url: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    genres: movie.genres?.map((g: any) => g.name) || [],
    director,
    actors,
  })
}