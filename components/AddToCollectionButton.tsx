"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Props {
  itemId: string
}

export default function AddToCollectionButton({ itemId }: Props) {

  const supabase = createClient()

  const [collections, setCollections] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")

  async function fetchCollections() {

    const { data } = await supabase
      .from("collections")
      .select("*")
      .eq("type", "manual")

    setCollections(data || [])

  }

  useEffect(() => {
    fetchCollections()
  }, [])

  async function handleAdd(collectionId: string) {

    setMessage(null)

    const { data: existing } = await supabase
      .from("collection_items")
      .select("id")
      .eq("collection_id", collectionId)
      .eq("item_id", itemId)
      .maybeSingle()

    if (existing) {
      setMessage("Ya está en esa colección.")
      return
    }

    const { error } = await supabase
      .from("collection_items")
      .insert([
        {
          collection_id: collectionId,
          item_id: itemId,
        },
      ])

    if (!error) {
      setMessage("Añadido correctamente.")
    }

  }

  async function handleCreateCollection() {

    if (!newCollectionName.trim()) return

    const { data, error } = await supabase
      .from("collections")
      .insert([
        {
          name: newCollectionName,
          type: "manual",
        },
      ])
      .select()
      .single()

    if (!error && data) {

      setNewCollectionName("")
      setCreating(false)

      await fetchCollections()

      setMessage("Colección creada.")

    }

  }

  return (
    <div className="relative inline-block">

      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/40"
      >
        + Añadir a colección
      </button>

      {open && (
        <div className="absolute left-0 mt-3 w-72 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-4 z-50 space-y-3">

          {/* LISTA COLECCIONES */}
          {collections.length > 0 && (
            <div className="space-y-2">

              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => handleAdd(col.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/10 transition"
                >
                  {col.name}
                </button>
              ))}

            </div>
          )}

          {/* CREAR NUEVA */}
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full text-left text-sm text-blue-400 hover:text-blue-300 transition"
            >
              + Nueva colección
            </button>
          ) : (
            <div className="space-y-2">

              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Nombre colección"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleCreateCollection}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition"
              >
                Crear
              </button>

            </div>
          )}

          {message && (
            <p className="text-xs text-blue-400">
              {message}
            </p>
          )}

        </div>
      )}

    </div>
  )
}