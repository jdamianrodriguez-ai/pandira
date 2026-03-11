export const videogameType = {
  type: "videogame",
  label: "Video Games",

  table: "games",

  highlightFields: [
    "platform",
  ],

  detailFields: [
    "genre",
  ],

  requiredFields: ["title"],

  validationRules: {},

  collectionBackground: "/backgrounds/videogame-texture.png",
}