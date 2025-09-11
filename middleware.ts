import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware simplificado - Firebase Auth maneja la autenticación
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Permitir todas las rutas por ahora
  // Firebase Auth maneja la protección en el cliente
  return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el middleware - más específico
export const config = {
  matcher: [
    /*
     * Match only specific protected paths:
     * - /dashboard (admin/user dashboards)
     * - /profile (user profiles)
     * Skip API routes, static files, and public assets
     */
    '/dashboard/:path*',
    '/profile/:path*'
  ],
}