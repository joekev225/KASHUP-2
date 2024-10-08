import { NextResponse } from 'next/server'
import { transactionSchema } from '../../../lib/validations'
import { z } from 'zod'

let transactions: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount } = transactionSchema.parse(body)
    
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      amount,
      date: new Date().toISOString()
    }
    
    transactions.push(newTransaction)
    
    return NextResponse.json(newTransaction)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Erreur lors de la création de la transaction:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(transactions)
}
