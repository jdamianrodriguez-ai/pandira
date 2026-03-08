export interface Movie {
  id: string
  tmdb_id: number

  title?: string
  original_title?: string
  year?: number

  poster?: string | null
  cover_url?: string | null

  genre?: string[] | string
  description?: string

  runtime?: number
  vote_average?: number

  director?: string
  actors?: string[] | string

  format?: "DVD" | "Blu-ray"

  status?: string
  location?: string
  value_estimate?: number

  watched?: boolean
  rating?: number
}

export const movieType = {
  type: "movie",
  label: "Movie",
  highlightFields: ["year", "rating", "format"],
  detailFields: [
    "original_title",
    "genre",
    "description",
    "status",
    "location",
    "value_estimate",
  ],
}