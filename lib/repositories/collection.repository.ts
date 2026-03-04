import { createServerComponentClient } from "@/lib/supabase/server"

export class CollectionRepository {

  private async getClient() {
    return await createServerComponentClient()
  }

  async getUserCollection(userId: string) {
    const supabase = await this.getClient()

    const { data, error } = await supabase
      .from("collection_items")
      .select(`*, catalog_items (*)`)
      .eq("user_id", userId)

    if (error) throw error
    return data
  }

  async getUserItem(userId: string, catalogItemId: string) {
    const supabase = await this.getClient()

    const { data, error } = await supabase
      .from("collection_items")
      .select("*")
      .eq("user_id", userId)
      .eq("catalog_item_id", catalogItemId)
      .single()

    if (error) throw error
    return data
  }

  async addToCollection(params: {
    userId: string
    catalogItemId: string
    rating?: number
    valueEstimate?: number
    format?: string
    condition?: string
    location?: string
    status?: string
  }) {
    const supabase = await this.getClient()

    const { error } = await supabase
      .from("collection_items")
      .insert({
        user_id: params.userId,
        catalog_item_id: params.catalogItemId,
        rating: params.rating,
        value_estimate: params.valueEstimate,
        format: params.format,
        condition: params.condition,
        location: params.location,
        status: params.status,
      })

    if (error) throw error
  }

  async removeFromCollection(userId: string, catalogItemId: string) {
    const supabase = await this.getClient()

    const { error } = await supabase
      .from("collection_items")
      .delete()
      .eq("user_id", userId)
      .eq("catalog_item_id", catalogItemId)

    if (error) throw error
  }
}