"use client"

import { useState } from "react"

type Props = {
mode?: "create" | "edit"
type: string
initialData?: any
onSubmit: (data: any) => Promise<void>
}

export default function DynamicItemForm({
type,
initialData = {},
onSubmit,
}: Props) {

const [formData, setFormData] = useState<any>({
type,
...initialData
})

function handleChange(key: string, value: any) {
setFormData((prev: any) => ({
...prev,
[key]: value
}))
}

async function handleSubmit(e: React.FormEvent) {
e.preventDefault()
await onSubmit(formData)
}

return (
  <form onSubmit={handleSubmit} className="space-y-4">

    <input
      type="text"
      value={formData.title || ""}
      onChange={(e) => handleChange("title", e.target.value)}
      placeholder="Title"
      className="border p-2 rounded w-full"
    />

    <textarea
      value={formData.description || ""}
      onChange={(e) => handleChange("description", e.target.value)}
      placeholder="Description"
      className="border p-2 rounded w-full"
    />

    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Save
    </button>

  </form>
)
}
