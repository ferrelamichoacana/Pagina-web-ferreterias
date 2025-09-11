import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware simplificado - Firebase Auth maneja la autenticación
export function middleware(request: NextRequest) {
  // Por ahora, solo permitir que todas las rutas pasen
  // Firebase Auth maneja la protección de rutas en el cliente
  return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}