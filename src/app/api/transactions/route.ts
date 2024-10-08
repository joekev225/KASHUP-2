import { NextResponse } from 'next/server'
import { transactionSchema } from '../../../lib/validations'
import { z } from 'zod'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia', // Utilisez la version API la plus récente
})

let transactions: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, paymentIntentId } = body as { amount: number; paymentIntentId: string }
    
    // Vérifier le statut du paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Le paiement n\'a pas été effectué' }, { status: 400 })
    }
    
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      amount,
      date: new Date().toISOString(),
      paymentIntentId
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
