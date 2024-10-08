import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_ici'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value

  if (request.nextUrl.pathname.startsWith('/api') && request.nextUrl.pathname !== '/api/auth' && request.nextUrl.pathname !== '/api/refresh') {
    if (!authToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    try {
      verify(authToken, JWT_SECRET)
    } catch (error) {
      // Si le token est expiré, essayez de le rafraîchir
      const refreshResponse = await fetch(`${request.nextUrl.origin}/api/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `authToken=${authToken}`
        }
      })

      if (refreshResponse.ok) {
        const response = NextResponse.next()
        response.headers.set('Set-Cookie', refreshResponse.headers.get('Set-Cookie') || '')
        return response
      } else {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
