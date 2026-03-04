import { CollectionRepository } from "@/lib/repositories/collection.repository"
import { createServerComponentClient } from "@/lib/supabase/server"
import GamesClient from "./GamesClient"

export default async function GamesPage() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>No autenticado</div>
  }

  const collectionRepository = new CollectionRepository()

  const collection = await collectionRepository.getUserCollection(user.id)

  const games =
    collection?.filter(
      (item: any) => item.catalog_items?.type === "game"
    ) || []

  return <GamesClient initialGames={games} />
}