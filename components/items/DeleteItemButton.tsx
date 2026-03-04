"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface Props {
  itemId: string
  deleteAction: (formData: FormData) => Promise<void>
}

export default function DeleteItemButton({ itemId, deleteAction }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    const confirmed = confirm("Are you sure you want to delete this item?")

    if (!confirmed) return

    const formData = new FormData()
    formData.append("id", itemId)

    startTransition(async () => {
      await deleteAction(formData)
      router.push("/")
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-semibold"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}