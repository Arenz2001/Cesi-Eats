"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDay: '',
    phoneNumber: '',
    vehicleType: 'car',
    vehicleLicense: '',
    deliveryZones: ''
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

    // Afficher les URLs utilisées
    console.log('URLs de l\'API:', {
      auth: process.env.NEXT_PUBLIC_AUTH_API_URL,
      delivery: process.env.NEXT_PUBLIC_DELIVERY_API_URL
    });

    try {
      // 1. Enregistrer dans le service d'authentification
      console.log('Tentative d\'inscription avec:', {
        email: formData.email,
        password: '******', // Masqué pour la sécurité
        role: 'delivery' // En minuscules, comme dans customer-app
      });
      
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'delivery' // En minuscules, comme dans customer-app
        })
      });

      console.log('Réponse du service auth:', {
        status: authResponse.status,
        statusText: authResponse.statusText
      });

      if (!authResponse.ok) {
        const authError = await authResponse.json().catch(e => {
          console.error('Erreur lors du parsing de la réponse d\'erreur:', e);
          return { message: 'Erreur inconnue du serveur d\'authentification' };
        });
        console.error('Détails de l\'erreur auth:', authError);
        throw new Error(authError.message || 'Erreur lors de l\'inscription');
      }

      const authData = await authResponse.json();
      console.log('Données auth reçues:', {
        tokenReçu: !!authData.token,
        userId: authData.user?.id
      });

      // 2. Enregistrer les informations du livreur dans le service de livraison
      console.log('Envoi des données livreur:', {
        Id_auth: authData.user.id,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        // autres champs omis pour la lisibilité
      });
      
      const deliveryUserData = {
        Id_auth: authData.user.id,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        PhoneNumber: formData.phoneNumber,
        BirthDay: formData.birthDay,
        VehicleType: formData.vehicleType,
        VehicleLicense: formData.vehicleLicense,
        DeliveryZones: formData.deliveryZones
      };
      
      console.log('Données complètes envoyées au service livreur:', deliveryUserData);
      
      // Essayer d'abord avec la route /api/deliverymen
      let deliveryResponse;
      try {
        deliveryResponse = await fetch(`${process.env.NEXT_PUBLIC_DELIVERY_API_URL}/api/deliverymen`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          },
          body: JSON.stringify(deliveryUserData)
        });
      } catch (deliveryError) {
        console.error('Erreur avec la première route, tentative avec la seconde route:', deliveryError);
        // En cas d'erreur, essayer avec la route /api/delivery
        deliveryResponse = await fetch(`${process.env.NEXT_PUBLIC_DELIVERY_API_URL}/api/delivery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          },
          body: JSON.stringify(deliveryUserData)
        });
      }

      console.log('Réponse du service delivery:', {
        status: deliveryResponse.status,
        statusText: deliveryResponse.statusText
      });

      if (!deliveryResponse.ok) {
        const deliveryError = await deliveryResponse.json().catch(e => {
          console.error('Erreur lors du parsing de la réponse d\'erreur:', e);
          return { message: 'Erreur inconnue du service de livraison' };
        });
        console.error('Détails de l\'erreur delivery:', deliveryError);
        throw new Error(deliveryError.message || 'Erreur lors de l\'enregistrement de vos informations');
      }

      // 3. Enregistrer le token et les informations utilisateur dans le localStorage
      localStorage.setItem('accessToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      toast.success("Inscription réussie ! Bienvenue chez CES'EATS Delivery.");
      
      // 4. Rediriger vers la page des commandes disponibles
      router.push('/commandes-disponibles');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || "Une erreur inconnue s'est produite");
      toast.error(err.message || "Erreur lors de l'inscription");
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
              <span className="mr-2">🚚</span> CES'EATS DELIVERY
            </h1>
            <h2 className="text-xl font-semibold mt-4 text-black">Rejoignez notre flotte de livreurs</h2>
            <p className="text-sm mt-2 text-black">
              Livrez des commandes et gagnez de l'argent facilement
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
              <select
                name="vehicleType"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.vehicleType}
                onChange={handleChange}
              >
                <option value="car">Voiture</option>
                <option value="motorcycle">Moto</option>
                <option value="bicycle">Vélo</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                name="vehicleLicense"
                placeholder="Numéro d'immatriculation*"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                required
                value={formData.vehicleLicense}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                type="text"
                name="deliveryZones"
                placeholder="Zones de livraison préférées (séparées par des virgules)"
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                value={formData.deliveryZones}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-500 font-medium">{error}</p>
                <p className="text-sm text-red-400 mt-1">
                  Vérifiez les informations saisies et réessayez. Si le problème persiste, contactez le support.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:bg-orange-300"
            >
              {loading ? 'Inscription en cours...' : 'Devenir livreur'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-gray-600 hover:text-gray-800 text-center mt-6">
            Déjà livreur ? <Link href="/login">Connectez-vous</Link>
          </p>
        </div>
      </div>

      {/* Right section - Delivery image */}
      <div className="hidden md:block w-1/2 relative">
        <div className="relative w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1542339234-b69260e64870"
            alt="Livraison de nourriture"
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