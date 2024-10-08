'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext } from '../../context/AppContext'

export default function Connexion() {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()
  const { setUser } = useAppContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.motDePasse }),
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
        router.push('/tableau-de-bord')
      } else {
        setError('Identifiants invalides')
      }
    } catch (error) {
      setError('Une erreur est survenue')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Connexion Marchand</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="motDePasse" className="block text-sm font-bold mb-2">Mot de passe</label>
          <input
            type="password"
            id="motDePasse"
            name="motDePasse"
            value={formData.motDePasse}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Se connecter
          </button>
          <Link href="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Retour à l'accueil
          </Link>
        </div>
      </form>
    </div>
  )
}
