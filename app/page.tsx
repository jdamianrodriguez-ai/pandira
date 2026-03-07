import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function Home() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex items-center justify-center h-[80vh] text-white">

      <div className="text-center space-y-10">

        <h1 className="text-6xl font-bold tracking-tight">
          Pandira
        </h1>

        <p className="text-gray-400 text-lg">
          Tu colección digital
        </p>

        <div className="flex gap-6 justify-center">

          <Link
            href="/movie"
            className="bg-white/10 hover:bg-white/20 transition px-8 py-4 rounded-xl text-lg"
          >
            🎬 Películas
          </Link>

          <Link
            href="/games"
            className="bg-white/10 hover:bg-white/20 transition px-8 py-4 rounded-xl text-lg"
          >
            🎮 Videojuegos
          </Link>

        </div>

      </div>

    </div>
  )
}