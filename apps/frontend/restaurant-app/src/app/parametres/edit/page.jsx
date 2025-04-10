'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditRestaurantPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        nom: 'KFC Orléans',
        email: 'contact@kfc-orleans.fr',
        rue: '123 Rue de la Volaille',
        ville: 'Orléans',
        codePostal: '45000',
        pays: 'France',
        horaires: [
            { jour: 'Lundi - Vendredi', plages: ['11:00 - 14:00', '18:00 - 22:00'] },
            { jour: 'Samedi', plages: ['11:00 - 23:00'] },
            { jour: 'Dimanche', plages: ['11:00 - 21:00'] },
        ],
    })

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

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('📤 Données envoyées :', form)
        router.push('/parametres')
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-6 py-12">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">✏️ Modifier les paramètres du restaurant</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Section title="Informations générales">
                        <Input label="Nom du restaurant" name="nom" value={form.nom} onChange={handleChange} />
                        <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
                    </Section>

                    <Section title="Adresse">
                        <Input label="Rue" name="rue" value={form.rue} onChange={handleChange} />
                        <Input label="Ville" name="ville" value={form.ville} onChange={handleChange} />
                        <Input label="Code Postal" name="codePostal" value={form.codePostal} onChange={handleChange} />
                        <Input label="Pays" name="pays" value={form.pays} onChange={handleChange} />
                    </Section>

                    <div>
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Heures d’ouverture</h2>
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

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow transition"
                        >
                            Enregistrer
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

function Input({ label, name, value, onChange, type = 'text' }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="text-sm text-gray-600 mb-1">{label}</label>
            <input
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
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
