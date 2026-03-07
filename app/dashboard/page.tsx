import { createServerComponentClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { count: moviesCount } = await supabase
    .from("movies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: gamesCount } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: collectionsCount } = await supabase
    .from("collections")
    .select("*", { count: "exact", head: true })
    .eq("type", "manual")

  return (
    <div className="px-12 py-16 text-white">

      <h1 className="text-5xl font-bold mb-12">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-8">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-gray-400 text-sm mb-2">
            Películas
          </p>
          <p className="text-4xl font-bold">
            {moviesCount ?? 0}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-gray-400 text-sm mb-2">
            Videojuegos
          </p>
          <p className="text-4xl font-bold">
            {gamesCount ?? 0}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-gray-400 text-sm mb-2">
            Colecciones
          </p>
          <p className="text-4xl font-bold">
            {collectionsCount ?? 0}
          </p>
        </div>

      </div>

      <div className="mt-16 flex gap-6">

        <a
          href="/movie"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition"
        >
          🎬 Ver películas
        </a>

        <a
          href="/games"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition"
        >
          🎮 Ver videojuegos
        </a>

      </div>

    </div>
  )
}