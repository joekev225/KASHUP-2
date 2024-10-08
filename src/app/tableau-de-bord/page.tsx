'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  amount: number
  date: string
}

export default function TableauDeBord() {
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { user, balance, setBalance } = useAppContext()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/connexion')
    } else {
      fetchTransactions()
    }
  }, [user, router])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des transactions')
      }
      const data = await response.json()
      setTransactions(data)
      const totalBalance = data.reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0)
      setBalance(totalBalance)
    } catch (error) {
      setError('Impossible de charger les transactions. Veuillez réessayer plus tard.')
      console.error('Erreur lors de la récupération des transactions:', error)
    }
  }

  const handleNewTransaction = async (amount: number) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la transaction')
      }
      const newTransaction = await response.json()
      setTransactions([...transactions, newTransaction])
      setBalance(balance + amount)
      setShowNewTransactionModal(false)
    } catch (error) {
      setError('Impossible de créer la transaction. Veuillez réessayer plus tard.')
      console.error('Erreur lors de la création de la transaction:', error)
    }
  }

  const handleWithdrawal = async (amount: number, bankAccount: string) => {
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bankAccount }),
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la demande de retrait')
      }
      const newWithdrawal = await response.json()
      setBalance(balance - amount)
      setShowWithdrawModal(false)
    } catch (error) {
      setError('Impossible de traiter la demande de retrait. Veuillez réessayer plus tard.')
      console.error('Erreur lors de la demande de retrait:', error)
    }
  }

  const toggleNewTransactionModal = () => setShowNewTransactionModal(!showNewTransactionModal)
  const toggleWithdrawModal = () => setShowWithdrawModal(!showWithdrawModal)

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Marchand</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Solde du Porte-monnaie</h2>
          <p className="text-3xl font-bold text-green-600">{balance} €</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transactions Récentes</h2>
          <ul className="space-y-2">
            {transactions.slice(-5).reverse().map((transaction) => (
              <li key={transaction.id} className="flex justify-between items-center">
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                <span className="font-semibold text-green-600">+{transaction.amount} €</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
          <button onClick={toggleNewTransactionModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 w-full">
            Nouvelle Transaction
          </button>
          <button onClick={toggleWithdrawModal} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
            Demande de Retrait
          </button>
        </div>
      </div>

      {showNewTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Nouvelle Transaction</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              console.log('Formulaire soumis')
              const amount = parseFloat((e.target as any).amount.value)
              console.log('Montant:', amount)
              handleNewTransaction(amount)
            }} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block mb-1">Montant</label>
                <input type="number" id="amount" name="amount" className="w-full border rounded px-2 py-1" required />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={toggleNewTransactionModal} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                  Annuler
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Demande de Retrait</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const amount = parseFloat((e.target as any).withdrawAmount.value)
              const bankAccount = (e.target as any).bankAccount.value
              handleWithdrawal(amount, bankAccount)
            }} className="space-y-4">
              <div>
                <label htmlFor="withdrawAmount" className="block mb-1">Montant à retirer</label>
                <input type="number" id="withdrawAmount" name="withdrawAmount" className="w-full border rounded px-2 py-1" required />
              </div>
              <div>
                <label htmlFor="bankAccount" className="block mb-1">Compte bancaire</label>
                <input type="text" id="bankAccount" name="bankAccount" className="w-full border rounded px-2 py-1" required />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={toggleWithdrawModal} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                  Annuler
                </button>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}