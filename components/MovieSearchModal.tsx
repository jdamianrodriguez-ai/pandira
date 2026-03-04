"use client"

interface Props {
  open: boolean
  results: any[]
  onClose: () => void
  onSelect: (movie: any, format: "DVD" | "Blu-ray") => void
}

export default function MovieSearchModal({
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
            Selecciona una película
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
          {results.map((movie) => (
            <div key={movie.tmdb_id} className="group">

              {movie.poster && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover rounded-lg shadow-md mb-2"
                />
              )}

              <p className="text-xs text-white truncate">
                {movie.title}
              </p>

              <p className="text-[11px] text-gray-400 mb-2">
                {movie.year}
              </p>

              {/* BOTONES FORMATO */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSelect(movie, "DVD")}
                  className="flex-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-md py-1 transition"
                >
                  DVD
                </button>

                <button
                  onClick={() => onSelect(movie, "Blu-ray")}
                  className="flex-1 text-[11px] bg-blue-900/60 hover:bg-blue-800 border border-blue-500/30 rounded-md py-1 transition"
                >
                  Blu-ray
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}