export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "array"
  | "select"
  | "currency"

export interface FieldDefinition {
  key: string
  label: string
  type: FieldType
  isCore?: boolean
}

export const fieldDefinitions: Record<string, FieldDefinition> = {
  title: {
    key: "title",
    label: "Title",
    type: "text",
    isCore: true,
  },
  original_title: {
    key: "original_title",
    label: "Original Title",
    type: "text",
  },
  year: {
    key: "year",
    label: "Year",
    type: "number",
  },
  description: {
    key: "description",
    label: "Description",
    type: "textarea",
  },
  genre: {
    key: "genre",
    label: "Genre",
    type: "array",
  },
  rating: {
    key: "rating",
    label: "Rating",
    type: "number",
  },
  status: {
    key: "status",
    label: "Status",
    type: "select",
  },
  format: {
    key: "format",
    label: "Format",
    type: "text",
  },
  platform: {
    key: "platform",
    label: "Platform",
    type: "text",
  },
  author: {
    key: "author",
    label: "Author",
    type: "text",
  },
  saga: {
    key: "saga",
    label: "Saga",
    type: "text",
  },
  edition: {
    key: "edition",
    label: "Edition",
    type: "text",
  },
  condition: {
    key: "condition",
    label: "Condition",
    type: "text",
  },
  location: {
    key: "location",
    label: "Location",
    type: "text",
  },
  value_estimate: {
    key: "value_estimate",
    label: "Estimated Value",
    type: "currency",
  },
}