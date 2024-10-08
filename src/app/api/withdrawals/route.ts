import { NextResponse } from 'next/server'

let withdrawals: any[] = []

export async function POST(request: Request) {
  const { amount, bankAccount } = await request.json()
  
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
}

export async function GET() {
  return NextResponse.json(withdrawals)
}
