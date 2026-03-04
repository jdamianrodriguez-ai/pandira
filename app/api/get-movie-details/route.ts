import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 })
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits&language=es-ES`
  )

  const data = await res.json()

  if (!data.id) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 })
  }

  const actors =
    data.credits?.cast?.slice(0, 5).map((a: any) => a.name) || []

  const director =
    data.credits?.crew?.find((c: any) => c.job === "Director")?.name || null

  const genres =
    data.genres?.map((g: any) => g.name) || []

  return NextResponse.json({
    tmdb_id: data.id,
    title: data.title,
    original_title: data.original_title,
    year: data.release_date?.split("-")[0] || null,
    overview: data.overview,
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : null,
    backdrop_url: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : null,
    runtime: data.runtime || null,
    vote_average: data.vote_average || null,
    director,
    actors,
    genres,
  })
}