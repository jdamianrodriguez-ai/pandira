import { movieType } from "./types/movie"
import { bookType } from "./types/book"
import { videogameType } from "./types/videogame"

export const typeRegistry = {
  movie: movieType,
  book: bookType,

  // Support both "game" and "videogame"
  game: videogameType,
  videogame: videogameType,
}

export function getTypeConfig(type: string) {
  return typeRegistry[type as keyof typeof typeRegistry]
}