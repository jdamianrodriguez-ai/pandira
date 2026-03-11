import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const RAWG_KEY = process.env.RAWG_API_KEY

async function syncGames() {

  console.log("Starting RAWG sync...\n")

  const { data: games, error } = await supabase
    .from("games")
    .select("id, rawg_id")

  if (error) {
    console.error("Error fetching games:", error)
    return
  }

  if (!games || games.length === 0) {
    console.log("No games found")
    return
  }

  for (const game of games) {

    try {

      const res = await fetch(
        `https://api.rawg.io/api/games/${game.rawg_id}?key=${RAWG_KEY}`
      )

      const rawg = await res.json()

      // limpiar markdown y saltos de línea
      const cleanDescription =
        rawg.description_raw
          ?.replace(/#+\s?/g, "")
          ?.replace(/\n/g, " ")
          ?.trim()

      await supabase
        .from("games")
        .update({
          description: cleanDescription
        })
        .eq("id", game.id)

      console.log("updated:", rawg.name)

    } catch (err) {

      console.error("Error syncing game:", game.rawg_id, err)

    }

  }

  console.log("\nRAWG sync finished")

}

syncGames()