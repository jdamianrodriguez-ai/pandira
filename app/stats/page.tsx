"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase
        .from("movies")
        .select("*");

      if (!data) return;

      const total = data.length;
      const dvds = data.filter(m => m.format === "DVD").length;
      const bluray = data.filter(m => m.format === "Blu-ray").length;
      const watched = data.filter(m => m.watched).length;
      const pending = data.filter(m => !m.watched).length;
      const packs = data.filter(m => m.is_pack).length;

      const rated = data.filter(m => m.rating !== null);
      const avgRating = rated.length
        ? (rated.reduce((sum, m) => sum + m.rating, 0) / rated.length).toFixed(2)
        : "0";

      setStats({
        total,
        dvds,
        bluray,
        watched,
        pending,
        packs,
        avgRating,
      });
    }

    fetchStats();
  }, []);

  if (!stats) return <div className="text-white p-10">Cargando...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <Link href="/" className="text-gray-400 hover:text-white">
        ← Volver
      </Link>

      <h1 className="text-4xl font-bold mb-10 mt-6">📊 Estadísticas</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-gray-400">Total películas</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-3xl font-bold">{stats.dvds}</p>
          <p className="text-gray-400">DVD</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-3xl font-bold">{stats.bluray}</p>
          <p className="text-gray-400">Blu-ray</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-3xl font-bold">{stats.watched}</p>
          <p className="text-gray-400">Vistas</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-3xl font-bold">{stats.pending}</p>
          <p className="text-gray-400">Pendientes</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-3xl font-bold">{stats.packs}</p>
          <p className="text-gray-400">Packs</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl col-span-2 md:col-span-3">
          <p className="text-3xl font-bold">{stats.avgRating}</p>
          <p className="text-gray-400">Media de puntuación</p>
        </div>

      </div>
    </main>
  );
}