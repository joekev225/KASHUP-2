'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  amount: number
  date: string
  status: string
}

interface WithdrawalRequest {
  id: string
  amount: number
  bankAccount: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const { user } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!user || (user as { role?: string }).role !== 'admin') {
      router.push('/connexion')
    } else {
      fetchTransactions()
      fetchWithdrawalRequests()
    }
  }, [user, router])

  const fetchTransactions = async () => {
    // Implémentez la logique pour récupérer les transactions
  }

  const fetchWithdrawalRequests = async () => {
    // Implémentez la logique pour récupérer les demandes de retrait
  }

  const handleApproveWithdrawal = async (id: string) => {
    // Implémentez la logique pour approuver une demande de retrait
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Administrateur</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Transactions récentes</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.amount} €</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Demandes de retrait en attente</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Montant</th>
              <th>Compte bancaire</th>
              <th>Date de demande</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.amount} €</td>
                <td>{request.bankAccount}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleApproveWithdrawal(request.id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Approuver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
