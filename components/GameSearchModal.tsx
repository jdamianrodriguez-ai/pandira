"use client"

interface Props {
  open: boolean
  results: any[]
  onClose: () => void
  onSelect: (game: any) => void
}

export default function GameSearchModal({
  open,
  results,
  onClose,
  onSelect,
}: Props) {

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">

      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 w-[1000px] max-h-[80vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-xl font-semibold text-white">
            Selecciona un videojuego
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>

        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {results.map((game: any, index: number) => {

            const id = game.id ?? game.rawg_id ?? index

            return (

              <div
                key={`game-${id}-${index}`}
                onClick={() => onSelect(game)}
                className="cursor-pointer group"
              >

                {game.background_image ? (

                  <img
                    src={game.background_image}
                    alt={game.name || "Game"}
                    className="w-full aspect-[3/4] object-cover rounded-lg shadow-md mb-2 group-hover:scale-105 transition"
                  />

                ) : (

                  <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-400">
                    RAWG #{id}
                  </div>

                )}

                <p className="text-xs text-white truncate">
                  {game.name || "Videojuego"}
                </p>

                {game.released && (
                  <p className="text-[11px] text-gray-400">
                    {game.released.split("-")[0]}
                  </p>
                )}

              </div>

            )

          })}

        </div>

      </div>

    </div>
  )
}