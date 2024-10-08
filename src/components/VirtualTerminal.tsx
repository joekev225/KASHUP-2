'use client'

import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

interface VirtualTerminalProps {
  onPaymentSuccess: (amount: number, paymentIntentId: string) => void
}

export default function VirtualTerminal({ onPaymentSuccess }: VirtualTerminalProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [amount, setAmount] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const { error: backendError, clientSecret } = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      }).then(r => r.json())

      if (backendError) {
        setError(backendError.message)
        setProcessing(false)
        return
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (stripeError) {
        setError(stripeError.message ?? 'Une erreur est survenue')
      } else if (paymentIntent.status === 'requires_capture') {
        onPaymentSuccess(parseFloat(amount), paymentIntent.id)
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(parseFloat(amount), paymentIntent.id)
      }
    } catch (error) {
      setError('Une erreur inattendue est survenue')
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Montant (EUR)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
          Informations de carte
        </label>
        <div className="mt-1">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {processing ? 'Traitement...' : 'Payer'}
      </button>
    </form>
  )
}
