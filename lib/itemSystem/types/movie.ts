export const movieType = {
  type: "movie",
  label: "Movies",

  table: "movies",

  highlightFields: ["year", "rating", "format"],

  detailFields: [
    "original_title",
    "genre",
    "description",
    "status",
    "location",
    "value_estimate",
  ],

  requiredFields: ["title"],

  validationRules: {
    year: { min: 1888 },
    rating: { min: 0, max: 10 },
  },

  collectionBackground: "/backgrounds/movie-texture.png",
}