import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerComponentClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // 👇 MUY IMPORTANTE
        setAll() {
          // NO HACEMOS NADA
          // En Server Components no se pueden modificar cookies
        },
      },
    }
  )
}