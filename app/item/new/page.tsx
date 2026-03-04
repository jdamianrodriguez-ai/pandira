import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import NewItemClient from "@/components/items/NewItemClient"

export default function NewItemPage() {
  const handleCreate = async (data: any) => {
    "use server"

    const { data: insertedItem, error } = await supabase
      .from("items")
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    redirect(`/item/${insertedItem.id}`)
  }

  return <NewItemClient onSubmit={handleCreate} />
}