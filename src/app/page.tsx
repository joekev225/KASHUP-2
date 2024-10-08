import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur KASHUP</h1>
      <p className="text-xl mb-8">La solution de paiement pour les entreprises hôtelières</p>
      <div className="flex gap-4">
        <Link href="/inscription" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          S'inscrire
        </Link>
        <Link href="/connexion" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Se connecter
        </Link>
      </div>
    </main>
  );
}
