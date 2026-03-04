export const bookType = {
  type: "book",
  label: "Books",

  highlightFields: ["year", "author", "rating"],

  detailFields: [
    "genre",
    "saga",
    "edition",
    "condition",
    "status",
    "location",
    "value_estimate",
  ],

  requiredFields: ["title", "author"],

  validationRules: {
    rating: { min: 0, max: 10 },
  },

  collectionBackground: "/backgrounds/book-texture.png",
}