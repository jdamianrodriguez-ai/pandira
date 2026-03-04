"use client";

import { useState } from "react";
import AIAssistantModal from "@/components/ai/AIAssistantModal";

interface Props {
  headerTitle: string;
  subtitle: string;
  itemCount: number;
  children: React.ReactNode;
}

export default function MovieHeaderClient({
  headerTitle,
  subtitle,
  itemCount,
  children,
}: Props) {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="relative px-10 pt-16 pb-12 text-white">

      {/* HEADER OPERATIVO */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-20">

        <div className="max-w-2xl">
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl tracking-tight leading-tight">
            {headerTitle}
          </h1>

          <p className="mt-4 text-gray-400 text-lg">
            {subtitle}
          </p>

          <div className="mt-6 text-xs text-gray-500 uppercase tracking-widest">
            {itemCount} títulos registrados
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex items-center gap-4">

          <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-sm transition-all duration-300">
            🔍 Explorar
          </button>

          <button
            onClick={() => setAiOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-sm transition-all duration-300"
          >
            🤖 IA
          </button>

          <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-sm transition-all duration-300">
            📷 Escanear
          </button>

          <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-sm transition-all duration-300">
            ⚙ Ajustes
          </button>
        </div>
      </div>

      {children}

      <AIAssistantModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
}