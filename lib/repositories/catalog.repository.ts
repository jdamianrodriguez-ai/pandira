import { createServerComponentClient } from "@/lib/supabase/server"

export class CatalogRepository {
  private async getClient() {
    return await createServerComponentClient()
  }

  async findByExternalId(externalId: string, source: string) {
    const supabase = await this.getClient()

    const { data, error } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("external_id", externalId)
      .eq("external_source", source)
      .single()

    if (error) throw error
    return data
  }

  async findById(id: string) {
    const supabase = await this.getClient()

    const { data, error } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  async getMovieWithDetails(id: string) {
    const supabase = await this.getClient()

    const { data, error } = await supabase
      .from("catalog_items")
      .select(`*, movies (*)`)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  async getGameWithDetails(id: string) {
    const supabase = await this.getClient()

    const { data, error } = await supabase
      .from("catalog_items")
      .select(`*, games (*)`)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }
}