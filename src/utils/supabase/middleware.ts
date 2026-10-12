import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response?: NextResponse) {
  let supabaseResponse = response || NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          if (!response) {
            supabaseResponse = NextResponse.next({ request })
          }
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do NOT add a logout or other redirects here.
  // This middleware is just to refresh the session.

  // Only refresh session if auth cookies actually exist to avoid unnecessary API roundtrips
  const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
  if (hasAuthCookie) {
    await supabase.auth.getUser()
  }

  return supabaseResponse
}
