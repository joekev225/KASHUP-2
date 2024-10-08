import { NextResponse } from 'next/server'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_ici'

export async function POST(request: Request) {
  const authToken = cookies().get('authToken')?.value

  if (!authToken) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const decoded = verify(authToken, JWT_SECRET) as { userId: string; email: string }
    const newToken = sign({ userId: decoded.userId, email: decoded.email }, JWT_SECRET, { expiresIn: '1h' })

    const response = NextResponse.json({ success: true })
    response.cookies.set('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600 // 1 heure
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
  }
}
