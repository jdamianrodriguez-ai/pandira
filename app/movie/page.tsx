import { CollectionRepository } from "@/lib/repositories/collection.repository"
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

  const collectionRepository = new CollectionRepository()
  const collection = await collectionRepository.getUserCollection(user.id)

  const movies =
    collection?.filter(
      (item: any) => item.catalog_items?.type === "movie"
    ) || []

  return <MoviesClient initialMovies={movies} />
}