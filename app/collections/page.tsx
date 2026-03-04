"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCollections() {
      const { data } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false })

      setCollections(data || [])
      setLoading(false)
    }

    fetchCollections()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-4xl font-bold">
              Colecciones
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              {collections.length} colecciones creadas
            </p>
          </div>

          <Link
            href="/collections/new"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-sm font-medium"
          >
            + Nueva colección
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Cargando...</p>
        ) : collections.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No hay colecciones todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group"
              >
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition shadow-lg">

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {collection.name}
                    </h3>

                    <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 border border-white/10">
                      {collection.type === "manual"
                        ? "Manual"
                        : "Inteligente"}
                    </span>
                  </div>

                  {collection.description && (
                    <p className="text-sm text-gray-400">
                      {collection.description}
                    </p>
                  )}

                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}