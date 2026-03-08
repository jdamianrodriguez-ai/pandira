import RemoveFromCollectionButton from "@/components/RemoveFromCollectionButton"
import { createServerComponentClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface PageProps {
  params: { id: string }
}

export default async function CollectionPage({ params }: PageProps) {

  const { id } = params
  const supabase = await createServerComponentClient()

  // Obtener colección
  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single()

  if (!collection) return notFound()

  // Obtener items relacionados con catálogo
  const { data: relations } = await supabase
    .from("collection_items")
    .select(`
      id,
      catalog_item_id,
      catalog_items (*)
    `)
    .eq("collection_id", id)

  const items =
    relations?.map((r: any) => ({
      relationId: r.id,
      catalogId: r.catalog_item_id,
      ...r.catalog_items,
    })) || []

  return (
    <div className="min-h-screen bg-black text-white px-10 pt-20 pb-16">

      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">
          {collection.name}
        </h1>
        <p className="text-gray-400 mt-3 text-sm">
          {items.length} elementos en esta categoría
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500">
          Esta categoría está vacía.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">

          {items.map((item: any) => (
            <div key={item.catalogId} className="group">

              <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">

                <div className="absolute top-3 right-3 z-50">
                  <RemoveFromCollectionButton
                    collectionId={id}
                    itemId={item.catalogId}
                  />
                </div>

                <Link href={`/item/${item.catalogId}`}>

                  {item.cover_url && (
                    <Image
                      src={item.cover_url}
                      alt={item.title}
                      width={300}
                      height={450}
                      className="relative z-0 w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}

                </Link>

                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">

                  <h3 className="text-sm font-semibold truncate">
                    {item.title}
                  </h3>

                  {item.year && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.year}
                    </p>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}