'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { toast, Toaster } from 'react-hot-toast'

export default function EditRestaurantPage() {
    const router = useRouter()
    const { user, getAuthToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const [form, setForm] = useState({
        nom: '',
        email: '',
        description: '',
        cuisineType: '',
        rue: '',
        ville: '',
        codePostal: '',
        pays: 'France',
        horaires: [
            { jour: 'Lundi - Vendredi', plages: ['11:00 - 14:00', '18:00 - 22:00'] },
            { jour: 'Samedi', plages: ['11:00 - 23:00'] },
            { jour: 'Dimanche', plages: ['11:00 - 21:00'] },
        ],
    })

    // Récupérer les données du restaurant
    useEffect(() => {
        const fetchRestaurantInfo = async () => {
            if (!user?.id_restaurant) {
                setLoading(false)
                setError("ID du restaurant non disponible")
                return
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/${user.id_restaurant}`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                })

                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status}`)
                }

                const data = await response.json()
                
                // Remplir le formulaire avec les données récupérées
                setForm({
                    nom: data.name || '',
                    email: user.email || '',
                    description: data.description || '',
                    cuisineType: data.cuisineType || '',
                    rue: data.address?.street || '',
                    ville: data.address?.city || '',
                    codePostal: data.address?.postalCode || '',
                    pays: data.address?.country || 'France',
                    // Garder les horaires fictifs pour l'instant
                    horaires: [
                        { jour: 'Lundi - Vendredi', plages: ['11:00 - 14:00', '18:00 - 22:00'] },
                        { jour: 'Samedi', plages: ['11:00 - 23:00'] },
                        { jour: 'Dimanche', plages: ['11:00 - 21:00'] },
                    ],
                })
                
                setLoading(false)
            } catch (err) {
                console.error('Erreur lors du chargement des informations du restaurant:', err)
                setError("Impossible de charger les informations du restaurant.")
                setLoading(false)
            }
        }

        fetchRestaurantInfo()
    }, [user, getAuthToken])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const addPlage = (index, horaire) => {
        if (!horaire) return
        const newHoraires = [...form.horaires]
        newHoraires[index].plages.push(horaire)
        setForm((prev) => ({ ...prev, horaires: newHoraires }))
    }

    const removePlage = (dayIndex, plageIndex) => {
        const newHoraires = [...form.horaires]
        newHoraires[dayIndex].plages.splice(plageIndex, 1)
        setForm((prev) => ({ ...prev, horaires: newHoraires }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!user?.id_restaurant) {
            setError("ID du restaurant non disponible")
            return
        }
        
        setSubmitting(true)
        
        try {
            // Préparer les données pour l'API
            const restaurantData = {
                name: form.nom,
                description: form.description,
                cuisineType: form.cuisineType,
                address: {
                    street: form.rue,
                    city: form.ville,
                    postalCode: form.codePostal,
                    country: form.pays
                }
                // Les horaires ne sont pas encore pris en charge par l'API
            }
            
            // Mettre à jour les données du restaurant
            const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/${user.id_restaurant}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(restaurantData)
            })
            
            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour: ${response.status}`)
            }
            
            // Afficher un message de succès et rediriger
            toast.success("Informations mises à jour avec succès")
            router.push('/parametres')
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err)
            setError("Impossible de mettre à jour les informations.")
            toast.error("Erreur lors de la mise à jour des informations")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff7ea]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-6 py-12">
            <Toaster position="top-center" />
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">✏️ Modifier les paramètres du restaurant</h1>

                {error && (
                    <div className="bg-red-100 p-4 rounded-md text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Section title="Informations générales">
                        <Input label="Nom du restaurant" name="nom" value={form.nom} onChange={handleChange} />
                        <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" readOnly />
                        <Input label="Type de cuisine" name="cuisineType" value={form.cuisineType} onChange={handleChange} />
                    </Section>
                    
                    <div>
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Description</h2>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <Section title="Adresse">
                        <Input label="Rue" name="rue" value={form.rue} onChange={handleChange} />
                        <Input label="Ville" name="ville" value={form.ville} onChange={handleChange} />
                        <Input label="Code Postal" name="codePostal" value={form.codePostal} onChange={handleChange} />
                        <Input label="Pays" name="pays" value={form.pays} onChange={handleChange} />
                    </Section>

                    <div>
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Heures d'ouverture</h2>
                        <div className="space-y-4">
                            {form.horaires.map((h, i) => (
                                <div key={i} className="border rounded-lg p-4 bg-gray-50">
                                    <p className="font-semibold text-gray-800 mb-2">{h.jour}</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {h.plages.map((p, j) => (
                                            <span
                                                key={j}
                                                className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                                            >
                                                {p}
                                                <button
                                                    type="button"
                                                    onClick={() => removePlage(i, j)}
                                                    className="text-orange-600 hover:text-red-600 font-bold ml-1"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <AddHoraireInput onAdd={(horaire) => addPlage(i, horaire)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={() => router.push('/parametres')}
                            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`${
                                submitting ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'
                            } text-white px-6 py-2 rounded-full shadow transition flex items-center`}
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement...
                                </>
                            ) : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Réutilisables
function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        </div>
    )
}

function Input({ label, name, value, onChange, type = 'text', readOnly = false }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="text-sm text-gray-600 mb-1">{label}</label>
            <input
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                readOnly={readOnly}
                className={`border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${readOnly ? 'bg-gray-100' : ''}`}
            />
        </div>
    )
}

// Ajout horaire avec validation
function AddHoraireInput({ onAdd }) {
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const isHoraireValid = (text) => {
        const pattern = /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/
        return pattern.test(text.trim())
    }

    const handleAdd = () => {
        const trimmed = value.trim()
        if (!trimmed) return

        if (!isHoraireValid(trimmed)) {
            setError("Format invalide. Utilise HH:MM - HH:MM")
            return
        }

        setError('')
        onAdd(trimmed)
        setValue('')
    }

    return (
        <div className="flex flex-col gap-1 mt-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="ex: 11:00 - 14:00"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        setError('')
                    }}
                    className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm"
                >
                    Ajouter
                </button>
            </div>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    )
}
