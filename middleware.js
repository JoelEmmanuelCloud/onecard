import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()
  
  const url = req.nextUrl.clone()
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile/edit', '/admin']
  const adminRoutes = ['/admin']
  const authRoutes = ['/auth', '/auth/verify-email']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some(route => 
    url.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    url.pathname.startsWith(route)
  )

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users from protected routes
  if (!session && isProtectedRoute) {
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Check admin access for admin routes
  if (session && isAdminRoute) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (error || profile?.role !== 'admin') {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Middleware admin check error:', error)
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}