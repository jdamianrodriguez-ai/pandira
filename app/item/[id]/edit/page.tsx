import { createServerComponentClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import DynamicItemForm from "@/components/items/DynamicItemForm"
import { getTypeConfig } from "@/lib/itemSystem/typeRegistry"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditItemPage({ params }: PageProps) {

  const { id } = await params
  const supabase = await createServerComponentClient()

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single()

console.log("EDIT ITEM TYPE:", item?.type)

  if (error || !item) {
    return notFound()
  }

  const typeConfig = getTypeConfig(item.type)

  if (!typeConfig) {
    return (
      <div className="p-10 text-red-500">
        Unknown type: {String(item.type)}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-10 text-white">
      <h1 className="text-2xl font-semibold mb-8">
        Edit {item.title}
      </h1>

<DynamicItemForm
  mode="edit"
  type={item.type}
  initialData={item}
  onSubmit={async (data) => {
    console.log("Saving item", data)
  }}
/>
    </div>
  )
}