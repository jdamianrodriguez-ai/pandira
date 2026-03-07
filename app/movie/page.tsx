import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"
import MoviesClient from "./MoviesClient"

export default async function MoviePage() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: movies, error } = await supabase
    .from("movies")
    .select("*")

  if (error) {
    console.error("Error cargando películas:", error)
    return <div>Error cargando películas</div>
  }

  return <MoviesClient initialMovies={movies || []} />
}