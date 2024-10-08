import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { z } from 'zod'
import logger from '../../../lib/logger'

const captureSchema = z.object({
  paymentIntentId: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentIntentId } = captureSchema.parse(body)

    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

    logger.info('Paiement capturé avec succès', { paymentIntentId })
    return NextResponse.json({ success: true, paymentIntent })
  } catch (error) {
    logger.error('Erreur lors de la capture du paiement', { error })
    return NextResponse.json({ error: 'Erreur lors de la capture du paiement' }, { status: 500 })
  }
}
