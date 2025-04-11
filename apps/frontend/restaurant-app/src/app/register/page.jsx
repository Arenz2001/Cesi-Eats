'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer les erreurs lors de la saisie
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation de l'email
    if (!formData.email) {
      newErrors.email = 'Veuillez saisir votre email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Veuillez saisir un mot de passe';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    // Validation de la confirmation du mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    // Validation du prénom
    if (!formData.name) {
      newErrors.name = 'Veuillez saisir votre prénom';
    }
    
    // Validation du nom
    if (!formData.address) {
      newErrors.address = 'Veuillez saisir votre adresse';
    }
    
    // Validation de l'entreprise
    if (!formData.city) {
      newErrors.city = 'Veuillez saisir le nom de votre entreprise';
    }
    
    // Validation du poste
    if (!formData.postalCode) {
      newErrors.postalCode = 'Veuillez saisir votre code postal';
    }

    if (!formData.country) {
        newErrors.country = 'Veuillez saisir votre code postal';
      }
    
    // Validation des conditions d'utilisation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Vous devez accepter les conditions d\'utilisation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Appel à l'API d'inscription
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'restaurant', // Rôle spécifique pour cette application
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Inscription réussie dans l'authentification
        // Maintenant, créer le profil restaurant
        try {
          const restaurantResponse = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/api/restaurants`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
              name: formData.name,
              address: {
                street: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
              },
              country: formData.country,
            }),
          });

          if (!restaurantResponse.ok) {
            const errorData = await restaurantResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erreur lors de la création du profil restaurant');
          } else {
            const restaurantData = await restaurantResponse.json();
            console.log('Profil restaurant créé avec succès:', restaurantData);
            
            // Stocker le token et les informations utilisateur
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Inscription réussie
            setRegisterSuccess(true);
            toast.success('Inscription réussie ! Redirection vers la page de connexion...');
            
            // Redirection après un délai (pour montrer le message de succès)
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          }
        } catch (error) {
          console.error('Erreur lors de la création du profil restaurant:', error);
          setRegisterError('Erreur lors de la création du profil restaurant. Veuillez réessayer.');
          toast.error('Erreur lors de la création du profil restaurant. Veuillez réessayer.');
        }
      } else {
        // Gestion des erreurs retournées par l'API
        setRegisterError(data.message || 'Erreur lors de l\'inscription');
        toast.error(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      setRegisterError('Erreur de connexion au serveur. Veuillez réessayer.');
      toast.error('Erreur de connexion au serveur. Veuillez réessayer.');
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" />
      {/* Left section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md mx-auto">
          {/* Logo and title */}
          <div className="mb-8">
            <h1 className="flex items-center font-bold text-black">
              <span className="mr-2 text-3xl">🍴 CES'EATS</span> <i className="text-l pl-1">Interface développeur</i>
            </h1>
            <h2 className="text-xl font-semibold mt-4 text-black">Créez votre compte développeur</h2>
            <p className="text-sm mt-2 text-black">
              Accédez aux APIs et développez des intégrations pour CES'EATS
            </p>
          </div>

          {/* Error message */}
          {registerError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {registerError}
            </div>
          )}

          {/* Success message */}
          {registerSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Inscription réussie ! Vous allez être redirigé vers la page de connexion...
            </div>
          )}

          {/* Registration form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="email"
                placeholder="email*"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                name="name"
                placeholder="nom*"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                name="address"
                placeholder="adresse"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.address ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                name="city"
                placeholder="ville*"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.city ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                name="postalCode"
                placeholder="code postal*"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.postalCode ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="country"
                placeholder="pays*"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.country ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe*"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe*"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className={`mt-1 mr-2 ${errors.agreeTerms ? 'border-red-500' : ''}`}
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                J'accepte les <Link href="/terms" className="text-orange-500 hover:underline">conditions d'utilisation</Link> et la <Link href="/privacy" className="text-orange-500 hover:underline">politique de confidentialité</Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 ${
                isLoading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'
              } text-white font-medium rounded-md transition-colors flex justify-center items-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription en cours...
                </>
              ) : 'Créer mon compte'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-gray-600 hover:text-gray-800 text-center mt-6">
            Déjà membre ? <Link href="/login" className="text-orange-500 hover:underline">Connectez-vous</Link>
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