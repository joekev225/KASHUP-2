import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { loginSchema } from '../../../lib/validations'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_ici'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Ici, vous implémenteriez la vérification réelle des identifiants
    if (email === 'test@example.com' && password === 'password') {
      const token = sign({ userId: '1', email }, JWT_SECRET, { expiresIn: '1h' })
      
      const response = NextResponse.json({ 
        success: true, 
        user: { id: '1', name: 'Test User', email: 'test@example.com' } 
      })
      
      response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600 // 1 heure
      })
      
      return response
    } else {
      return NextResponse.json({ success: false, message: 'Identifiants invalides' }, { status: 401 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Erreur interne du serveur' }, { status: 500 })
  }
}
