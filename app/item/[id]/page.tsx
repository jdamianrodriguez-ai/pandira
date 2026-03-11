import { createServerComponentClient } from "@/lib/supabase/server"
import { getTypeConfig } from "@/lib/itemSystem/typeRegistry"
import { notFound } from "next/navigation"

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const supabase = await createServerComponentClient()

  const tables = ["movies", "games"]

  let item: any = null
  let type: string | null = null

  for (const table of tables) {

    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single()

    if (data) {
      item = data
      type = table === "movies" ? "movie" : "videogame"
      break
    }

  }

  if (!item || !type) {
    return notFound()
  }

  const config = getTypeConfig(type)

  if (!config) {
    return notFound()
  }

  const cover =
    item.cover ||
    item.cover_url ||
    item.poster ||
    item.poster_url ||
    null

  const year =
    item.year ||
    item.release_year ||
    (item.release_date ? new Date(item.release_date).getFullYear() : null)

  const description =
    item.description ||
    item.overview ||
    null

  return (
    <div className="px-16 pt-20 text-white flex gap-16">

      {/* PORTADA */}
      <div className="w-[420px] flex-shrink-0">
        {cover && (
          <img
            src={cover}
            alt={item.title}
            className="rounded-xl shadow-2xl"
          />
        )}
      </div>

      {/* INFO */}
      <div className="max-w-2xl">

        <h1 className="text-5xl font-bold mb-6">
          {item.title}
        </h1>

        <div className="space-y-2 mb-6 text-gray-300">

          {year && (
            <div>
              📅 Año: {year}
            </div>
          )}

          {item.platform && (
            <div>
              🎮 Plataforma: {item.platform}
            </div>
          )}

          {item.genre && (
            <div>
              🧩 Géneros: {Array.isArray(item.genre) ? item.genre.join(", ") : item.genre}
            </div>
          )}

        </div>

        {description && (
          <p className="text-gray-300 leading-relaxed">
            {description}
          </p>
        )}

      </div>

    </div>
  )
}