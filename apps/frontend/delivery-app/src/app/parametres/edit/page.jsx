'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditProfilPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        nom: 'Jean Dupont',
        email: 'jean.dupont@livreur.com',
        rue: '1 rue de la Poste',
        ville: 'Orléans',
        codePostal: '45000',
        pays: 'France',
        disponibilites: [
            { jour: 'Lundi', horaires: ['08:00 - 12:00'] },
            { jour: 'Mardi', horaires: ['09:00 - 17:00'] },
            { jour: 'Mercredi', horaires: [] },
            { jour: 'Jeudi', horaires: ['08:00 - 12:00'] },
            { jour: 'Vendredi', horaires: ['09:00 - 12:00'] },
            { jour: 'Samedi', horaires: [] },
            { jour: 'Dimanche', horaires: [] },
        ],
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const addHoraire = (index, horaire) => {
        if (!horaire) return
        const newDispos = [...form.disponibilites]
        newDispos[index].horaires.push(horaire)
        setForm((prev) => ({ ...prev, disponibilites: newDispos }))
    }

    const removeHoraire = (dayIndex, horaireIndex) => {
        const newDispos = [...form.disponibilites]
        newDispos[dayIndex].horaires.splice(horaireIndex, 1)
        setForm((prev) => ({ ...prev, disponibilites: newDispos }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('✅ Données enregistrées :', form)
        router.push('/parametres')
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-6 py-12">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">✏️ Modifier mon profil</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Section title="Informations personnelles">
                        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} />
                        <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
                    </Section>

                    <Section title="Adresse">
                        <Input label="Rue" name="rue" value={form.rue} onChange={handleChange} />
                        <Input label="Ville" name="ville" value={form.ville} onChange={handleChange} />
                        <Input label="Code Postal" name="codePostal" value={form.codePostal} onChange={handleChange} />
                        <Input label="Pays" name="pays" value={form.pays} onChange={handleChange} />
                    </Section>

                    <div>
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Disponibilités</h2>
                        <div className="space-y-4">
                            {form.disponibilites.map((day, i) => (
                                <div key={i} className="border rounded-lg p-4 bg-gray-50">
                                    <p className="font-semibold text-gray-700 mb-2">{day.jour}</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {day.horaires.length > 0 ? (
                                            day.horaires.map((h, j) => (
                                                <span
                                                    key={j}
                                                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                                                >
                                                    {h}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeHoraire(i, j)}
                                                        className="text-orange-600 hover:text-red-600 font-bold ml-1"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Aucune disponibilité</span>
                                        )}
                                    </div>
                                    <AddHoraireInput onAdd={(horaire) => addHoraire(i, horaire)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow transition"
                        >
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function Input({ label, name, value, onChange, type = 'text' }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="text-sm text-gray-600 mb-1">
                {label}
            </label>
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

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        </div>
    )
}

// ✔️ Version avec validation
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
                    placeholder="ex: 14:00 - 18:00"
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
