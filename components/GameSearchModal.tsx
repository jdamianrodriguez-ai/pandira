"use client"

interface Props {
  open: boolean
  results: any[]
  onClose: () => void
  onSelect: (game: any) => void
}

export default function GameSearchModal({ open, results, onClose, onSelect }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">

      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-5xl w-full max-h-[80vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Selecciona un videojuego
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
          {results.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelect(game)}
              className="cursor-pointer group"
            >
              {game.background_image && (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="rounded-lg aspect-[3/4] object-cover group-hover:scale-105 transition"
                />
              )}
              <p className="text-sm text-gray-200 mt-2 truncate">
                {game.name}
              </p>
              <p className="text-xs text-gray-400">
                {game.released?.split("-")[0]}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}