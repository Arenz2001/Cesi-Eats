"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDay: '',
    phoneNumber: '',
    referralCode: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Registering user with auth service...');
      // 1. Enregistrer dans le service d'authentification
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'customer' // Rôle par défaut pour un utilisateur
        })
      });

      if (!authResponse.ok) {
        const authError = await authResponse.json();
        throw new Error(authError.message || 'Erreur lors de l\'inscription');
      }

      const authData = await authResponse.json();
      console.log('Auth registration successful:', authData);

      // 2. Enregistrer les informations personnelles dans le service client
      console.log('Registering user data with customer service...');
      const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify({
          Id_auth: authData.user.id, // ID de l'utilisateur créé dans le service d'authentification
          FirstName: formData.firstName,
          LastName: formData.lastName,
          PhoneNumber: formData.phoneNumber,
          BirthDay: formData.birthDay,
          ReferralCode: formData.referralCode || null
        })
      });

      if (!customerResponse.ok) {
        // En cas d'échec, il faudrait idéalement supprimer l'utilisateur créé dans le service d'authentification
        const customerError = await customerResponse.json();
        throw new Error(customerError.message || 'Erreur lors de l\'enregistrement de vos informations');
      }

      console.log('Customer registration successful');

      // 3. Enregistrer le token et les informations utilisateur dans le localStorage
      localStorage.setItem('accessToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      // 4. Rediriger vers la page de profil
      router.push('/profil');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <p className="text-sm mt-2 text-black">
              Explorez les restaurants et passez vos commandes facilement
            </p>
          </div>

          {/* Registration form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="Prénom*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Nom*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                type="text"
                name="birthDay"
                placeholder="Date de naissance (DD/MM/YYYY)*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.birthDay}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Numéro de téléphone*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                type="text"
                name="referralCode"
                placeholder="Code parrainage"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:bg-orange-300"
            >
              {loading ? 'Inscription en cours...' : 'S\'enregistrer'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-gray-600 hover:text-gray-800 text-center mt-6">
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
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}
