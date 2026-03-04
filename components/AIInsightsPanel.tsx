"use client"

import { useEffect, useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
}

export default function AIInsightsPanel({ open, onClose }: Props) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    async function fetchInsights() {
      setLoading(true)
      const res = await fetch("/api/collection-insights")
      const json = await res.json()
      setData(json)
      setLoading(false)
    }

    fetchInsights()
  }, [open])

  function getCollectorLevel(total: number) {
    if (total < 50) return "🎬 Aficionado"
    if (total < 150) return "🎥 Curador"
    if (total < 400) return "🧠 Archivista"
    return "👑 Coleccionista Maestro"
  }

  function buildProfileNarrative() {
    if (!data) return ""

    const level = getCollectorLevel(data.totalMovies)

    return `
${level}

Tu colección muestra una fuerte inclinación hacia el género ${data.topGenre}.
La década predominante es la de los ${data.dominantDecade}.
Destacan figuras como ${data.topDirector} y ${data.topActor}.
`
  }

  function buildDiagnostics() {
    if (!data) return []

    const diagnostics: string[] = []

    const pending = data.allMovies.filter((m: any) => m.status === "pending").length
    const longMovies = data.allMovies.filter((m: any) => m.runtime && m.runtime > 120).length
    const rated = data.allMovies.filter((m: any) => m.vote_average).length

    if (pending > 20) {
      diagnostics.push(`Tienes ${pending} películas pendientes. Esto empieza a parecer acumulación estratégica.`)
    }

    if (longMovies > data.totalMovies * 0.5) {
      diagnostics.push("Más del 50% de tu colección supera las 2 horas. Tienes paciencia cinematográfica.")
    }

    if (rated < data.totalMovies * 0.3) {
      diagnostics.push("Solo una pequeña parte de tu colección está valorada. Quizá quieras puntuar más títulos.")
    }

    return diagnostics
  }

  function handleQuestion() {
    if (!question || !data) return

    const q = question.toLowerCase()

    if ((q.includes("cuántas") || q.includes("cuantas") || q.includes("total")) && q.includes("pel")) {
      setAnswer(`Tienes ${data.totalMovies} películas registradas.`)
    } else if (q.includes("actor")) {
      setAnswer(`El actor dominante es ${data.topActor}.`)
    } else if (q.includes("director")) {
      setAnswer(`El director dominante es ${data.topDirector}.`)
    } else if (q.includes("larga")) {
      setAnswer(`La película más larga es ${data.longestMovie}.`)
    } else if (q.includes("género") || q.includes("genero")) {
      setAnswer(`El género predominante es ${data.topGenre}.`)
    } else if (q.includes("pendiente")) {
      const count = data.allMovies.filter((m: any) => m.status === "pending").length
      setAnswer(`Tienes ${count} pendientes.`)
    } else {
      setAnswer("Esa pregunta aún no la sé responder… pero sigo evolucionando 😉")
    }
  }

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[500px] bg-neutral-950 border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 h-full flex flex-col overflow-y-auto">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              🤖 Asistente Pandira
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {loading && (
            <p className="text-gray-400 text-sm">Analizando archivo cinematográfico...</p>
          )}

          {data && !loading && (
            <>
              {/* PERFIL */}
              <div className="mb-10 p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase text-gray-500 mb-2">
                  Perfil Cinematográfico
                </p>
                <p className="text-sm whitespace-pre-line text-gray-200">
                  {buildProfileNarrative()}
                </p>
              </div>

              {/* MÉTRICAS */}
              <div className="space-y-6 text-sm mb-10">
                <Metric label="Total películas" value={data.totalMovies} />
                <Metric label="Actor dominante" value={data.topActor} />
                <Metric label="Director dominante" value={data.topDirector} />
                <Metric label="Película más larga" value={data.longestMovie} />
                <Metric label="Duración media" value={`${data.averageRuntime} min`} />
                <Metric label="Género predominante" value={data.topGenre} />
              </div>

              {/* DIAGNÓSTICO */}
              <div className="mb-10 space-y-3">
                {buildDiagnostics().map((d, i) => (
                  <div key={i} className="text-sm bg-white/5 p-4 rounded-xl border border-white/10">
                    {d}
                  </div>
                ))}
              </div>

              {/* CHAT */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-sm text-gray-400 mb-3">
                  ¿Quieres profundizar? Haz una pregunta.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ej: ¿Cuántas películas tengo?"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={handleQuestion}
                    className="bg-blue-600 hover:bg-blue-700 transition px-4 rounded-lg text-sm"
                  >
                    Preguntar
                  </button>
                </div>

                {answer && (
                  <div className="mt-4 text-sm text-gray-200 bg-white/5 p-4 rounded-xl border border-white/10">
                    {answer}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-gray-500 uppercase text-xs mb-1">
        {label}
      </p>
      <p className="text-lg font-medium">
        {value || "N/D"}
      </p>
    </div>
  )
}