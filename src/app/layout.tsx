import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { AppProvider } from '../context/AppContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KASHUP - Solution de paiement pour hôtels',
  description: 'Plateforme de paiement virtuel pour les entreprises hôtelières',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AppProvider>
          <header className="bg-blue-500 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">KASHUP</Link>
              <div>
                <Link href="/inscription" className="mr-4 hover:underline">S'inscrire</Link>
                <Link href="/connexion" className="hover:underline">Se connecter</Link>
              </div>
            </nav>
          </header>
          <main className="container mx-auto mt-8">
            {children}
          </main>
          <footer className="bg-gray-200 text-center p-4 mt-8">
            <p>&copy; 2024 KASHUP. Tous droits réservés.</p>
          </footer>
        </AppProvider>
      </body>
    </html>
  )
}
