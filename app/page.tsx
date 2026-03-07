import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"

export default async function Home() {

  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si NO está logueado → login
  if (!user) {
    redirect("/login")
  }

  // Si está logueado → colección
  redirect("/movie")

}