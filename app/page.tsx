'use client'

import { useState, useEffect } from 'react'

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

export default function Home() {
  const [spots, setSpots] = useState<JamonSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/jamon?lat=33.5017&lng=-117.6625&radius=100')
      .then(res => res.json())
      .then(data => {
        console.log('Data:', data)
        setSpots(data.spots || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍖</div>
          <p className="text-amber-800 text-xl">Finding jamón...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-800 text-white p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">🍖 Jamón Locator</h1>
        <p className="text-amber-200 text-sm">{spots.length} spots found near San Juan Capistrano</p>
      </header>

      {/* Spots List */}
      <main className="p-4">
        {spots.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No spots found</p>
        ) : (
          <div className="space-y-3">
            {spots.map((spot) => (
              <a
                key={spot.id}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl p-4 shadow-md border border-amber-200 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-amber-900">{spot.name}</h2>
                    <p className="text-gray-600 text-sm">{spot.address}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {spot.jamonTypes.map((t) => (
                        <span 
                          key={t} 
                          className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-amber-600">{spot.jamonScore}/5</div>
                    <div className="text-sm text-gray-500">{spot.priceRange}</div>
                    {spot.distance !== undefined && (
                      <div className="text-xs text-gray-400 mt-1">{spot.distance.toFixed(1)} mi</div>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-center bg-amber-600 text-white py-2 rounded-lg font-semibold">
                  Open in Maps 📍
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
