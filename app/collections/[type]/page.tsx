import { createServerComponentClient } from "@/lib/supabase/server"
import { getTypeConfig } from "@/lib/itemSystem/typeRegistry"
import CollectionLayout from "@/components/items/CollectionLayout"
import Link from "next/link"

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>
  searchParams: Promise<{ filter?: string }>
}) {

  const supabase = await createServerComponentClient()

  const { type } = await params
  const { filter } = await searchParams

  const config = getTypeConfig(type)

  if (!config) {
    console.log("Tipo recibido:", type)
    return <div>Tipo de colección desconocido</div>
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>No autenticado</div>
  }

  const { data: collections } = await supabase
    .from("collections")
    .select("id")
    .eq("user_id", user.id)

  if (!collections || collections.length === 0) {
    return <div>No hay colecciones</div>
  }

  const collectionIds = collections.map((c) => c.id)

  const { data: items, error: itemsError } = await supabase
    .from("collection_items")
    .select("catalog_item_id")
    .in("collection_id", collectionIds)

  if (itemsError) {
    console.error("Error cargando collection_items:", itemsError)
    return <div>Error cargando colección</div>
  }

  if (!items || items.length === 0) {
    return <div>No hay items</div>
  }

  const itemIds = items.map((item) => item.catalog_item_id)

  let query = supabase
    .from((config as any).table)
    .select("*")
    .in("id", itemIds)

  // aplicar filtro DVD / Blu-ray
  if (filter) {
    query = query.eq("format", filter)
  }

  const { data: objects, error } = await query

  if (error) {
    console.error(error)
    return <div>Error cargando colección</div>
  }

  return (
    <CollectionLayout background={(config as any).collectionBackground}>
      <div className="px-10 pt-20 pb-16 text-white">

        <h1 className="text-5xl font-bold mb-10">
          {(config as any).label}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">

          {objects?.map((item: any) => {

            const cover =
              item.cover ||
              item.cover_url ||
              item.poster ||
              item.poster_url ||
              null

            return (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="group"
              >

                <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                  <div className="aspect-[3/4] w-full">

                    {cover ? (
                      <img
                        src={cover}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                        Sin portada
                      </div>
                    )}

                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">

                    <h3 className="text-sm font-semibold truncate">
                      {item.title || "Item"}
                    </h3>

                  </div>

                </div>

              </Link>
            )

          })}

        </div>

      </div>
    </CollectionLayout>
  )
}