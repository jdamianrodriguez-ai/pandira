import { createServerComponentClient } from "@/lib/supabase/server"
import MoviesClient from "./MoviesClient"

export default async function MoviePage() {
  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>No autenticado</div>
  }

  const { data: movies } = await supabase
    .from("movies")
    .select("*")

  return <MoviesClient initialMovies={movies || []} />
}