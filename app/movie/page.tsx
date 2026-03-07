import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"
import MoviesClient from "./MoviesClient"

export default async function MoviePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {

  const params = await searchParams
  const filter = params?.filter ?? null

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let query = supabase
    .from("movies")
    .select("*")

  // aplica filtro si viene en la URL
  if (filter) {
    query = query.eq("format", filter)
  }

  const { data: movies, error } = await query

  if (error) {
    console.error("Error cargando películas:", error)
    return <div>Error cargando películas</div>
  }

  return <MoviesClient initialMovies={movies || []} />
}