'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import map to avoid SSR issues with Leaflet
const JamonMap = dynamic(() => import('@/components/JamonMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🍖</div>
        <p className="text-amber-800 text-xl font-semibold">Finding the finest jamón...</p>
      </div>
    </div>
  )
})

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        (err) => {
          console.error('Geolocation error:', err)
          // Default to San Juan Capistrano area if geolocation fails
          setLocation({ lat: 33.5017, lng: -117.6625 })
          setError('Using default location. Enable location for better results.')
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      setLocation({ lat: 33.5017, lng: -117.6625 })
      setError('Geolocation not supported')
    }
  }, [])

  if (!location) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🍖</div>
          <p className="text-amber-800 text-xl font-semibold">Locating you...</p>
          <p className="text-amber-600 text-sm mt-2">Please allow location access</p>
        </div>
      </div>
    )
  }

  return (
    <main className="h-screen w-full relative">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg shadow-lg text-sm">
          {error}
        </div>
      )}
      <JamonMap center={location} />
    </main>
  )
}
