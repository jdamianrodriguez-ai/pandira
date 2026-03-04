import AddToCollectionButton from "@/components/AddToCollectionButton"
import { createServerComponentClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import DeleteItemButton from "@/components/items/DeleteItemButton"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ItemPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerComponentClient()

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !item) return notFound()

  const deleteItem = async (formData: FormData) => {
    "use server"
    const supabase = await createServerComponentClient()
    const deleteId = formData.get("id") as string
    await supabase.from("items").delete().eq("id", deleteId)
  }

  const genres =
    Array.isArray(item.genre) && item.genre.length > 0
      ? item.genre.join(", ")
      : item.genre

  return (
    <div className="bg-black text-white min-h-screen">

      {/* BACKDROP */}
      {item.backdrop_url && (
        <div className="relative h-[600px] w-full overflow-hidden">
          <img
            src={item.backdrop_url}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-8 -mt-64 relative z-10">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-20">

          {/* IZQUIERDA */}
          <div className="max-w-3xl">

            <h1 className="text-6xl md:text-7xl font-semibold tracking-tight leading-tight mb-6 drop-shadow-2xl">
              {item.title}
            </h1>

            <div className="text-gray-300 text-sm tracking-wide">
              {item.year && <span>{item.year}</span>}
              {item.runtime && <span> • {item.runtime} min</span>}
              {genres && <span> • {genres}</span>}
              {item.format && <span> • {item.format}</span>}
            </div>

            {item.vote_average && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-gray-200 text-lg">
                  {Number(item.vote_average).toFixed(1)}
                </span>
              </div>
            )}

            {item.director && (
              <div className="mt-3 text-gray-300 text-sm">
                Dir. {item.director}
              </div>
            )}

            {item.actors && item.actors.length > 0 && (
              <div className="mt-4 text-gray-400 text-sm leading-relaxed">
                {item.actors.slice(0, 5).join(" · ")}
              </div>
            )}

            {/* BOTÓN AÑADIR A COLECCIÓN */}
            <div className="mt-6">
              <AddToCollectionButton itemId={item.id} />
            </div>

          </div>

          {/* DERECHA */}
          <div className="flex gap-3 items-start">
            <Link
              href={`/item/${item.id}/edit`}
              className="bg-gray-800 hover:bg-gray-700 transition px-4 py-2 rounded-lg text-sm"
            >
              Edit
            </Link>

            <DeleteItemButton
              itemId={item.id}
              deleteAction={deleteItem}
            />
          </div>

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 pb-20">

          {/* Poster */}
          <div>
            {item.cover_url && (
              <img
                src={item.cover_url}
                alt={item.title}
                className="w-full max-w-xs rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
              />
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            {item.description && (
              <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
                {item.description}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}