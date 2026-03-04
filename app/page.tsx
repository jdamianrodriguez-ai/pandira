"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white flex items-center justify-center px-6">

      <div className="text-center space-y-12">

        <h1 className="text-5xl font-bold tracking-tight">
          Pandira
        </h1>

        <p className="text-gray-400">
          Tu colección digital de entretenimiento
        </p>

        <div className="flex gap-8 justify-center">

          <Link
            href="/movie"
            className="bg-white/10 hover:bg-white/20 transition px-8 py-4 rounded-xl"
          >
            🎬 Películas
          </Link>

          <Link
            href="/games"
            className="bg-white/10 hover:bg-white/20 transition px-8 py-4 rounded-xl"
          >
            🎮 Videojuegos
          </Link>

        </div>

      </div>

    </div>
  )
}