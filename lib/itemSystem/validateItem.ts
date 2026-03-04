import { getTypeConfig } from "./typeRegistry"

export interface ValidationError {
  field: string
  message: string
}

export function validateItem(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  const typeConfig = getTypeConfig(data.type)

  if (!typeConfig) {
    errors.push({ field: "type", message: "Invalid item type" })
    return errors
  }

  const { requiredFields = [], validationRules = {} } = typeConfig as any

  requiredFields.forEach((field: string) => {
    if (!data[field] || data[field] === "") {
      errors.push({
        field,
        message: `${field} is required`,
      })
    }
  })

  Object.entries(validationRules).forEach(([field, rules]: any) => {
    const value = data[field]
    if (value === undefined || value === null) return

    if (rules.min !== undefined && value < rules.min) {
      errors.push({
        field,
        message: `${field} must be at least ${rules.min}`,
      })
    }

    if (rules.max !== undefined && value > rules.max) {
      errors.push({
        field,
        message: `${field} must be at most ${rules.max}`,
      })
    }
  })

  return errors
}