import { NextResponse } from 'next/server'
import { withdrawalSchema } from '../../../lib/validations'
import { z } from 'zod'

let withdrawals: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, bankAccount } = withdrawalSchema.parse(body)
    
    const newWithdrawal = {
      id: (withdrawals.length + 1).toString(),
      amount,
      bankAccount,
      status: 'pending',
      date: new Date().toISOString()
    }
    
    withdrawals.push(newWithdrawal)
    
    // Ici, vous implémenteriez la logique réelle pour traiter le retrait
    
    return NextResponse.json(newWithdrawal)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Erreur lors de la création du retrait:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(withdrawals)
}
