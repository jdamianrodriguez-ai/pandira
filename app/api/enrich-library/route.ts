import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function normalizeForSearch(title?: string) {
  if (!title) return "";

  return title
    .replace(/\b(IV|V|VI|VII|VIII|IX|X)\b/gi, "")
    .replace(/\b(Coleccion|Pack|Saga|Trilogia)\b/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function searchMovie(apiKey: string, query: string, language: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&language=${language}`
  );
  return res.json();
}

async function searchCollection(apiKey: string, query: string, language: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/collection?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&language=${language}`
  );
  return res.json();
}

export async function POST() {
  try {
    const { data: movies, error } = await supabase
      .from("movies")
      .select("*");

    if (error) throw error;

    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      throw new Error("TMDB_API_KEY no configurada");
    }

    for (const movie of movies || []) {

      // 🚫 si no tiene título lo ignoramos
      if (!movie.title) {
        console.log("Película sin título, ignorada:", movie.id);
        continue;
      }

      // 🚫 si tiene poster personalizado no tocar
      if (movie.custom_poster) {
        console.log("Poster personalizado, ignorado:", movie.title);
        continue;
      }

      const searchTitle = normalizeForSearch(movie.title);

      if (!searchTitle) continue;

      let searchData = await searchMovie(apiKey, searchTitle, "es-ES");

      if (!searchData.results || searchData.results.length === 0) {
        searchData = await searchMovie(apiKey, searchTitle, "en-US");
      }

      if (searchData.results && searchData.results.length > 0) {

        let bestMatch = searchData.results[0];

        if (movie.year) {
          const matchByYear = searchData.results.find((r: any) =>
            r.release_date?.startsWith(String(movie.year))
          );

          if (matchByYear) bestMatch = matchByYear;
        }

        await supabase
          .from("movies")
          .update({
            title: bestMatch.title,
            overview: bestMatch.overview,
            poster: bestMatch.poster_path
              ? `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}`
              : null,
            year: bestMatch.release_date
              ? parseInt(bestMatch.release_date.substring(0, 4))
              : movie.year,
          })
          .eq("id", movie.id);

        console.log("Actualizada:", bestMatch.title);

        continue;
      }

      let collectionData = await searchCollection(apiKey, searchTitle, "es-ES");

      if (!collectionData.results || collectionData.results.length === 0) {
        collectionData = await searchCollection(apiKey, searchTitle, "en-US");
      }

      if (collectionData.results && collectionData.results.length > 0) {

        const collection = collectionData.results[0];

        await supabase
          .from("movies")
          .update({
            overview: collection.overview,
            poster: collection.poster_path
              ? `https://image.tmdb.org/t/p/w500${collection.poster_path}`
              : null,
          })
          .eq("id", movie.id);

        console.log("Colección encontrada:", searchTitle);

        continue;
      }

      console.log("No encontrada:", searchTitle);
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {

    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}