"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Props {
  collectionId: string
  itemId: string
}

export default function RemoveFromCollectionButton({ collectionId, itemId }: Props) {

  const router = useRouter()
  const supabase = createClient()

  async function handleRemove(e: React.MouseEvent) {

    e.stopPropagation()
    e.preventDefault()

    await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", collectionId)
      .eq("item_id", itemId)

    router.refresh()

  }

  return (
    <button
      onClick={handleRemove}
      className="
        bg-red-600
        hover:bg-red-700
        text-white
        text-xs
        w-6
        h-6
        rounded-full
        flex
        items-center
        justify-center
        shadow-lg
        transition
      "
    >
      ×
    </button>
  )
}