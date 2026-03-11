export const videogameType = {
  type: "videogame",
  label: "Video Games",

  table: "games",

  highlightFields: [
    "platform",
    "year",
    "rating",
  ],

  detailFields: [
    "genre",
    "description",
    "developer",
    "publisher",
    "status",
    "location",
  ],

  requiredFields: ["title"],

  validationRules: {
    rating: { min: 0, max: 10 },
  },

  collectionBackground: "/backgrounds/videogame-texture.png",
}