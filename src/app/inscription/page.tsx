'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Inscription() {
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    email: '',
    motDePasse: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Données du formulaire:', formData)
    // Ici, vous ajouterez plus tard la logique pour envoyer les données au backend
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Inscription Marchand</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="nomEntreprise" className="block text-sm font-bold mb-2">Nom de l'entreprise</label>
          <input
            type="text"
            id="nomEntreprise"
            name="nomEntreprise"
            value={formData.nomEntreprise}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
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
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            S'inscrire
          </button>
          <Link href="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Retour à l'accueil
          </Link>
        </div>
      </form>
    </div>
  )
}
