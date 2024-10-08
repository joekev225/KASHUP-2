import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { transactionSchema } from '../../../lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount } = transactionSchema.parse(body)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency: 'eur',
      capture_method: 'manual', // Ceci permet de capturer le paiement manuellement plus tard
      payment_method_types: ['card'],
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de l\'intention de paiement' }, { status: 500 })
  }
}
