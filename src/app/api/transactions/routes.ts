import { NextResponse } from 'next/server'

let transactions = [
  { id: '1', amount: 100, date: '2024-03-01' },
  { id: '2', amount: 200, date: '2024-03-02' },
  { id: '3', amount: 150, date: '2024-03-03' },
]

export async function GET() {
  return NextResponse.json(transactions)
}

export async function POST(request: Request) {
  const { amount } = await request.json()
  const newTransaction = {
    id: (transactions.length + 1).toString(),
    amount: amount,
    date: new Date().toISOString().split('T')[0]
  }
  transactions.push(newTransaction)
  return NextResponse.json(newTransaction)
}
