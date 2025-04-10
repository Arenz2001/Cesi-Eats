'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    position: '',
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
    if (!formData.firstName) {
      newErrors.firstName = 'Veuillez saisir votre prénom';
    }
    
    // Validation du nom
    if (!formData.lastName) {
      newErrors.lastName = 'Veuillez saisir votre nom';
    }
    
    // Validation de l'entreprise
    if (!formData.company) {
      newErrors.company = 'Veuillez saisir le nom de votre entreprise';
    }
    
    // Validation du poste
    if (!formData.position) {
      newErrors.position = 'Veuillez saisir votre poste';
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
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: 'developper' // Rôle spécifique pour cette application
        }),
      });

      if (!authResponse.ok) {
        const authError = await authResponse.json();
        throw new Error(authError.message || 'Erreur lors de l\'inscription');
      }

      const authData = await authResponse.json();
      console.log('Inscription réussie:', authData);

      // Maintenant, créer le profil développeur
      try {
        const developerResponse = await fetch(`${process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL}/api/developers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          },
          body: JSON.stringify({
            userId: authData.user.id,
            company: formData.company,
            position: formData.position
          }),
        });

        // Vérifier d'abord si la requête a échoué
        if (!developerResponse.ok) {
          // Tenter de lire la réponse en tant que JSON
          let developerError;
          try {
            developerError = await developerResponse.json();
          } catch (e) {
            // Si ce n'est pas du JSON, utiliser le texte brut
            const errorText = await developerResponse.text();
            throw new Error(`Erreur lors de la création du profil développeur (${developerResponse.status}): ${errorText}`);
          }
          throw new Error(developerError.message || 'Erreur lors de la création du profil développeur');
        }

        // Tenter de lire la réponse en tant que JSON
        let developerData;
        try {
          developerData = await developerResponse.json();
        } catch (e) {
          console.warn('La réponse n\'était pas au format JSON, mais la requête a réussi');
          developerData = { success: true };
        }
        
        console.log('Profil développeur créé avec succès:', developerData);
        
        // Inscription réussie
        setRegisterSuccess(true);
        
        // Redirection après un délai (pour montrer le message de succès)
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Erreur lors de la création du profil développeur:', error);
        setRegisterError(error.message || 'Erreur lors de la création du profil développeur');
      }
    } catch (error) {
      setRegisterError(error.message || 'Erreur lors de l\'inscription');
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-8 overflow-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom*"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom*"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email*"
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
            
            <div>
              <input
                type="text"
                name="company"
                placeholder="Entreprise*"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.company ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                name="position"
                placeholder="Poste*"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-100 border ${
                  errors.position ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-black`}
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
              )}
            </div>
            
            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 mr-2"
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
              } text-white font-medium rounded-md transition-colors flex justify-center items-center mt-6`}
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
            src="https://images.unsplash.com/photo-1518770660439-4636190af475"
            alt="Image d'un développeur"
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