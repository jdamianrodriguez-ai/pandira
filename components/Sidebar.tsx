"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "@/components/LogoutButton";

export default function Sidebar() {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams?.get("filter") ?? null;

  const [collections, setCollections] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {

    const supabase = createClient();

    async function loadData() {

      // usuario
      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData?.user?.email ?? null);

      // colecciones
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("type", "manual")
        .order("name", { ascending: true });

      if (!error && data) {
        setCollections(data);
      }

    }

    loadData();

  }, []);

  function isActive(path: string, filterValue?: string) {

    if (pathname !== path) return false;

    // página base (Películas)
    if (!filterValue) {
      return filter === null;
    }

    // filtros
    return filter === filterValue;

  }

  function collectionActive(id: string) {
    return pathname === `/collections/${id}`;
  }

  function linkClasses(active: boolean) {

    if (active) {
      return "relative block px-4 py-2 rounded-xl transition-all duration-300 bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]";
    }

    return "relative block px-4 py-2 rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5";

  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white/5 backdrop-blur-2xl border-r border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] flex flex-col">

      {/* HEADER */}
      <div className="relative px-6 pt-10 pb-8">

        <h1 className="text-2xl tracking-wide text-white">
          Pandira
        </h1>

        <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
          Collector Edition
        </p>

      </div>

      {/* MENU */}
      <nav className="relative px-4 space-y-8 text-sm flex-1">

        <div>

          <div className="text-xs text-gray-400 uppercase tracking-widest px-4 mb-3">
            Colección
          </div>

          <Link
            href="/movie"
            className={linkClasses(isActive("/movie"))}
          >
            🎬 Películas
          </Link>

          <div className="mt-4 ml-4 space-y-2 border-l border-white/10 pl-4">

            <Link
              href="/movie?filter=DVD"
              className={linkClasses(isActive("/movie", "DVD"))}
            >
              DVD
            </Link>

            <Link
              href="/movie?filter=Blu-ray"
              className={linkClasses(isActive("/movie", "Blu-ray"))}
            >
              Blu-ray
            </Link>

            {collections.length > 0 && (
              <>
                <div className="mt-4 text-xs text-gray-500 uppercase tracking-wider">
                  Categorías
                </div>

                {collections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className={linkClasses(collectionActive(col.id))}
                  >
                    📁 {col.name}
                  </Link>
                ))}
              </>
            )}

          </div>

          <Link
            href="/games"
            className={linkClasses(pathname === "/games")}
          >
            🎮 Videojuegos
          </Link>

        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="space-y-3">

          <div className="text-xs text-gray-400 uppercase tracking-widest px-4">
            Próximamente
          </div>

          <div className="px-4 py-2 text-gray-500">
            📚 Libros
          </div>

          <div className="px-4 py-2 text-gray-500">
            📖 Cómics
          </div>

        </div>

      </nav>

      {/* USER */}
      <div className="px-6 pb-2 border-t border-white/10 pt-6">

        {userEmail && (
          <div className="text-xs text-gray-400 mb-3 truncate">
            {userEmail}
          </div>
        )}

      </div>

      {/* LOGOUT */}
      <div className="px-6 pb-8">
        <LogoutButton />
      </div>

    </aside>
  );

}