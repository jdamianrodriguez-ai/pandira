export const videogameType = {
  type: "videogame",
  label: "Video Games",

  highlightFields: ["platform", "year", "rating"],

  detailFields: [
    "genre",
    "format",
    "condition",
    "status",
    "location",
    "value_estimate",
  ],

  requiredFields: ["title"],

  validationRules: {
    rating: { min: 0, max: 10 },
  },

  collectionBackground: "/backgrounds/videogame-texture.png",
}