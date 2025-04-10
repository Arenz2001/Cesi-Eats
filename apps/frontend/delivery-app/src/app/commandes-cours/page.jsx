"use client"
import CommandeEnCours from '@/components/CommandeEnCours'

export default function Page() {
    const commande = {
        id: '12340',
        status: 'En attente de récupération',
        eta: '12min',
        restaurant: 'McDonalds',
        restaurantAdresse: '1 rue machin, Orléans',
        items: '1 menu mcFirst',
        total: 15,
        revenu: 5,
        bonus: '1€',
        mapImage: '/images/map.png',
        client: {
            nom: 'David Smith',
            adresse: '1 rue machin, Orléans',
            tel: '06 12 34 56 78',
        },
        onUpdateStatus: () => alert('Statut mis à jour !'),
    }

    return <CommandeEnCours commande={commande} />
}
