'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface JamonSpot {
  id: string
  name: string
  lat: number
  lng: number
  jamonScore: number
  jamonTypes: string[]
  priceRange: string
  address: string
  distance?: number
}

// Must dynamically import anything using Leaflet (no SSR)
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <LoadingScreen message="Loading map..." />
})

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🍖</div>
        <p className="text-amber-800 text-xl">{message}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [spots, setSpots] = useState<JamonSpot[]>([])
  const [center, setCenter] = useState({ lat: 33.5017, lng: -117.6625 })
  const [status, setStatus] = useState('Loading...')
  const [ready, setReady] = useState(false)

  // Fetch spots on mount
  useEffect(() => {
    async function init() {
      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => console.log('Using default location')
        )
      }

      // Fetch spots
      setStatus('Finding jamón spots...')
      try {
        const res = await fetch(`/api/jamon?lat=${center.lat}&lng=${center.lng}&radius=100`)
        const data = await res.json()
        console.log('API response:', data)
        
        if (data.spots && data.spots.length > 0) {
          setSpots(data.spots)
          setStatus(`Found ${data.spots.length} spots!`)
        } else {
          setStatus('No spots found')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setStatus('Error loading spots')
      }
      
      setReady(true)
    }
    init()
  }, [])

  // Re-fetch when center changes
  useEffect(() => {
    if (!ready) return
    
    async function refetch() {
      try {
        const res = await fetch(`/api/jamon?lat=${center.lat}&lng=${center.lng}&radius=100`)
        const data = await res.json()
        if (data.spots) {
          setSpots(data.spots)
          setStatus(`Found ${data.spots.length} spots!`)
        }
      } catch (err) {
        console.error('Refetch error:', err)
      }
    }
    refetch()
  }, [center, ready])

  if (!ready) {
    return <LoadingScreen message={status} />
  }

  return (
    <main className="h-screen w-full relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-amber-900 to-transparent p-4 pb-16">
        <h1 className="text-2xl font-bold text-white">🍖 Jamón Locator</h1>
        <p className="text-amber-100 text-sm">{status}</p>
      </div>

      {/* Map */}
      <MapView center={center} spots={spots} />

      {/* Spot list */}
      {spots.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-2xl max-h-[35vh] overflow-y-auto">
          <div className="p-3 border-b sticky top-0 bg-white">
            <div className="w-12 h-1 bg-gray-300 rounded mx-auto mb-2"></div>
            <span className="font-semibold text-amber-800">{spots.length} Jamón Spots</span>
          </div>
          {spots.map((spot) => (
            <a
              key={spot.id}
              href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 border-b hover:bg-amber-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                  <p className="text-sm text-gray-600">{spot.address}</p>
                  <div className="flex gap-1 mt-1">
                    {spot.jamonTypes.slice(0, 2).map((t) => (
                      <span key={t} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-600 font-bold">{spot.jamonScore}/5</div>
                  <div className="text-xs text-gray-500">{spot.priceRange}</div>
                  {spot.distance && (
                    <div className="text-xs text-gray-400">{spot.distance.toFixed(1)} mi</div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
