"use client";

import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantModal({ isOpen, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    fetch("/api/ai-insights")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">

      <div className="relative w-full max-w-xl rounded-2xl bg-[#111] border border-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>

        <h2 className="font-[var(--font-display)] text-3xl mb-6">
          🤖 Asistente Pandira
        </h2>

        {loading && (
          <p className="text-gray-400">Analizando tu colección...</p>
        )}

        {data && !loading && (
          <div className="space-y-4 text-gray-300">

            <p>
              🎬 Tu década dominante es{" "}
              <span className="text-white font-semibold">
                {data.dominantDecade}s
              </span>.
              Bastante carácter cinematográfico, debo admitir.
            </p>

            <p>
              🎭 Género principal:{" "}
              <span className="text-white font-semibold">
                {data.dominantGenre || "Misteriosamente indefinido"}
              </span>.
              Interesante elección…
            </p>

            <p>
              ⏳ Tienes{" "}
              <span className="text-white font-semibold">
                {data.pendingCount}
              </span>{" "}
              películas pendientes.
              Esto empieza a parecer una acumulación estratégica.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider">
                Recomendación de hoy
              </p>
              <p className="text-lg text-white font-semibold">
                {data.recommendation}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}