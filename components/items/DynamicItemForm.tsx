"use client"

import { useState } from "react"
import { fieldDefinitions } from "@/lib/itemSystem/fieldDefinitions"
import { getTypeConfig } from "@/lib/itemSystem/typeRegistry"
import { validateItem, ValidationError } from "@/lib/itemSystem/validateItem"

interface DynamicItemFormProps {
  type: string
  initialData?: any
  onSubmit: (data: any) => Promise<void>
}

export default function DynamicItemForm({
  type,
  initialData = {},
  onSubmit,
}: DynamicItemFormProps) {
  const typeConfig = getTypeConfig(type)

  if (!typeConfig) {
    return <div className="text-red-500">Unknown type: {type}</div>
  }

  const allFields = [
    ...typeConfig.highlightFields,
    ...typeConfig.detailFields,
  ]

  const [formData, setFormData] = useState<any>({
    type,
    ...initialData,
  })

  const [errors, setErrors] = useState<ValidationError[]>([])

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const getFieldError = (fieldKey: string) => {
    return errors.find((err) => err.field === fieldKey)
  }

  const renderInput = (fieldKey: string) => {
    const definition = fieldDefinitions[fieldKey]
    if (!definition) return null

    const value = formData[fieldKey] ?? ""
    const fieldError = getFieldError(fieldKey)

    const baseInputClass =
      "w-full bg-gray-800 border rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"

    const errorClass = fieldError
      ? "border-red-500"
      : "border-gray-700"

    switch (definition.type) {
      case "textarea":
        return (
          <>
            <textarea
              className={`${baseInputClass} ${errorClass}`}
              value={value}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
            />
            {fieldError && (
              <div className="text-red-500 text-sm mt-1">
                {fieldError.message}
              </div>
            )}
          </>
        )

      case "number":
        return (
          <>
            <input
              type="number"
              className={`${baseInputClass} ${errorClass}`}
              value={value}
              onChange={(e) =>
                handleChange(
                  fieldKey,
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
            />
            {fieldError && (
              <div className="text-red-500 text-sm mt-1">
                {fieldError.message}
              </div>
            )}
          </>
        )

      case "currency":
        return (
          <>
            <input
              type="number"
              step="0.01"
              className={`${baseInputClass} ${errorClass}`}
              value={value}
              onChange={(e) =>
                handleChange(
                  fieldKey,
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
            />
            {fieldError && (
              <div className="text-red-500 text-sm mt-1">
                {fieldError.message}
              </div>
            )}
          </>
        )

      case "array":
        return (
          <>
            <input
              type="text"
              placeholder="Comma separated"
              className={`${baseInputClass} ${errorClass}`}
              value={Array.isArray(value) ? value.join(", ") : value}
              onChange={(e) =>
                handleChange(
                  fieldKey,
                  e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter((v) => v !== "")
                )
              }
            />
            {fieldError && (
              <div className="text-red-500 text-sm mt-1">
                {fieldError.message}
              </div>
            )}
          </>
        )

      default:
        return (
          <>
            <input
              type="text"
              className={`${baseInputClass} ${errorClass}`}
              value={value}
              onChange={(e) =>
                handleChange(fieldKey, e.target.value)
              }
            />
            {fieldError && (
              <div className="text-red-500 text-sm mt-1">
                {fieldError.message}
              </div>
            )}
          </>
        )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateItem(formData)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])

    await onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 text-white space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">
        {initialData?.id ? "Edit Item" : "Create Item"}
      </h2>

      {allFields.map((fieldKey) => {
        const definition = fieldDefinitions[fieldKey]
        if (!definition) return null

        return (
          <div key={fieldKey}>
            <label className="block text-sm text-gray-400 mb-2">
              {definition.label}
            </label>
            {renderInput(fieldKey)}
          </div>
        )
      })}

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
      >
        Save
      </button>
    </form>
  )
}