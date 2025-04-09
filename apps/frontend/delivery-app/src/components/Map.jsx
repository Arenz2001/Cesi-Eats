'use client'

import React, { useState, useEffect } from 'react'
import {
    GoogleMap,
    useJsApiLoader,
    DirectionsRenderer,
} from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '500px',
}

const center = {
    lat: 47.9025, // Orléans
    lng: 1.909,
}

export default function MapWithDirections() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    })

    const [directions, setDirections] = useState(null)

    useEffect(() => {
        if (!isLoaded) return

        const directionsService = new google.maps.DirectionsService()

        directionsService.route(
            {
                origin: 'Orléans, France',
                destination: 'Olivet, France',
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result)
                } else {
                    console.error('Erreur de calcul d’itinéraire :', result)
                }
            }
        )
    }, [isLoaded])

    if (!isLoaded) return <p>Chargement de la carte...</p>

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    )
}
