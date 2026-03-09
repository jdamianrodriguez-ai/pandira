import { movieType } from "./types/movie"
import { bookType } from "./types/book"
import { videogameType } from "./types/videogame"

const registry = {
  movie: movieType,
  book: bookType,
  videogame: videogameType,
}

const aliases: Record<string, keyof typeof registry> = {
  game: "videogame",
}

export function getTypeConfig(type: string) {

  const normalized =
    aliases[type] ||
    (type as keyof typeof registry)

  const config = registry[normalized]

  if (!config) {
    console.warn(`Unknown item type: ${type}`)
    return null
  }

  return config
}

export const typeRegistry = registry