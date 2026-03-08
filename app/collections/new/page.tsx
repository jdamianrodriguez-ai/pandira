"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function NewCollectionPage() {

  const supabase = createClient()
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"manual" | "smart">("manual")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return

    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from("collections")
      .insert([
        {
          name,
          description,
          type,
          rules: type === "smart" ? {} : null
        }
      ])

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/collections")
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-12">
          Nueva colección
        </h1>

        <form onSubmit={handleCreate} className="space-y-8">

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Tipo de colección
            </label>

            <div className="flex gap-4">

              <button
                type="button"
                onClick={() => setType("manual")}
                className={`px-6 py-3 rounded-lg border transition ${
                  type === "manual"
                    ? "bg-blue-600 border-blue-500"
                    : "bg-neutral-900 border-white/10"
                }`}
              >
                Manual
              </button>

              <button
                type="button"
                onClick={() => setType("smart")}
                className={`px-6 py-3 rounded-lg border transition ${
                  type === "smart"
                    ? "bg-blue-600 border-blue-500"
                    : "bg-neutral-900 border-white/10"
                }`}
              >
                Inteligente
              </button>

            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear colección"}
          </button>

        </form>
      </div>
    </div>
  )
}