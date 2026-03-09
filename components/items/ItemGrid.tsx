"use client"

import Link from "next/link"

interface Props {
  items: any[]
  basePath: string
}

export default function ItemGrid({ items, basePath }: Props) {

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">

      {items.map((item: any) => {

        const cover = item.cover || item.cover_url

        return (

          <Link
            href={`/${basePath}/${item.id}`}
            key={item.id}
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

                {item.platform && (
                  <p className="text-xs text-gray-400 mt-1">
                    {Array.isArray(item.platform)
                      ? item.platform.join(", ")
                      : item.platform}
                  </p>
                )}

              </div>

            </div>

          </Link>

        )

      })}

    </div>
  )
}