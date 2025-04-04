import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Left section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md mx-auto">
          {/* Logo and title */}
          <div className="mb-8">
            <h1 className="flex items-center text-3xl font-bold text-black">
              <span className="mr-2">🍴</span> CES'EATS
            </h1>
            <h2 className="text-xl font-semibold mt-4 text-black">Rejoignez-nous pour commander</h2>
            <p className="text-sm mt-2  text-black">
              Explorez les restaurants et passez vos commandes facilement
            </p>
          </div>

          {/* Registration form */}
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Prénom*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Nom*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Mot de passe*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Date de naissance (DD/MM/YYYY)*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Numéro de téléphone*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Code parrainage"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors"
            >
              S'enregistrer
            </button>
          </form>

          {/* Login link */}
          <p href="#" className="text-gray-600 hover:text-gray-800 text-center mt-6">
            Déjà membre ? <Link href="/login">Connectez-vous</Link>
          </p>
        </div>
      </div>

      {/* Right section - Food image */}
      <div className="hidden md:block w-1/2 relative">
        <div className="relative w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
            alt="Plat de nourriture"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}
