import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 })
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`
  )

  const data = await res.json()

  if (!data.results) {
    return NextResponse.json({ error: "No results" }, { status: 404 })
  }

  const results = data.results.slice(0, 6).map((movie: any) => ({
    tmdb_id: movie.id,
    title: movie.title,
    original_title: movie.original_title,
    year: movie.release_date?.split("-")[0] || null,
    overview: movie.overview,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
  }))

  return NextResponse.json({ results })
}