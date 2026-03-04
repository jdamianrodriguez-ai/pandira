"use client"

import { useState } from "react"
import DynamicItemForm from "./DynamicItemForm"
import { typeRegistry } from "@/lib/itemSystem/typeRegistry"

interface Props {
  onSubmit: (data: any) => Promise<void>
}

export default function NewItemClient({ onSubmit }: Props) {
  const typeKeys = Object.keys(typeRegistry)
  const [selectedType, setSelectedType] = useState(typeKeys[0])

  return (
    <div className="max-w-3xl mx-auto p-8 text-white space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Item Type
        </label>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {typeKeys.map((key) => (
            <option key={key} value={key}>
              {typeRegistry[key].label}
            </option>
          ))}
        </select>
      </div>

      <DynamicItemForm
        type={selectedType}
        onSubmit={onSubmit}
      />
    </div>
  )
}