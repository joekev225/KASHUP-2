import { NextResponse } from 'next/server'
import { z } from 'zod'

// Simulons une base de données pour les demandes de retrait
let withdrawalRequests: any[] = []

const withdrawalSchema = z.object({
  amount: z.number().positive(),
  bankAccount: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, bankAccount } = withdrawalSchema.parse(body)

    const newRequest = {
      id: Date.now().toString(),
      amount,
      bankAccount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    withdrawalRequests.push(newRequest)

    return NextResponse.json({ success: true, request: newRequest })
  } catch (error) {
    console.error('Erreur lors de la création de la demande de retrait:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la demande de retrait' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(withdrawalRequests)
}
