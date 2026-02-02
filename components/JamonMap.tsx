'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom jamon marker icon
const jamonIcon = new L.DivIcon({
  html: '<div style="font-size: 28px; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));">🍖</div>',
  className: 'jamon-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

const userIcon = new L.DivIcon({
  html: '<div style="font-size: 24px;">📍</div>',
  className: 'user-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
})

export interface JamonSpot {
  id: string
  name: string
  lat: number
  lng: number
  rating: number
  reviews: number
  jamonScore: number // 1-5, how good the jamon is
  jamonTypes: string[]
  priceRange: string
  address: string
  highlights: string[]
  source: string
}

// Component to recenter map
function MapRecenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap()
  useEffect(() => {
    map.setView([center.lat, center.lng], 13)
  }, [center, map])
  return null
}

// Rating stars display
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-amber-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

interface JamonMapProps {
  center: { lat: number; lng: number }
}

export default function JamonMap({ center }: JamonMapProps) {
  const [spots, setSpots] = useState<JamonSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpot, setSelectedSpot] = useState<JamonSpot | null>(null)

  useEffect(() => {
    async function fetchSpots() {
      try {
        const res = await fetch(`/api/jamon?lat=${center.lat}&lng=${center.lng}`)
        const data = await res.json()
        setSpots(data.spots || [])
      } catch (err) {
        console.error('Failed to fetch spots:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSpots()
  }, [center])

  return (
    <div className="h-full w-full relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-amber-900/90 to-transparent p-4 pb-12">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🍖 Jamón Locator
        </h1>
        <p className="text-amber-100 text-sm">Find the finest jamón near you</p>
      </div>

      {/* Results count */}
      {!loading && spots.length > 0 && (
        <div className="absolute top-20 left-4 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg">
          <span className="text-amber-800 font-semibold">{spots.length} spots found</span>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={center} />
        
        {/* User location marker */}
        <Marker position={[center.lat, center.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <strong>You are here</strong>
            </div>
          </Popup>
        </Marker>

        {/* Jamon spots */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={jamonIcon}
            eventHandlers={{
              click: () => setSelectedSpot(spot),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg text-amber-900">{spot.name}</h3>
                <div className="flex items-center gap-2 my-1">
                  <RatingStars rating={spot.jamonScore} />
                  <span className="text-sm text-gray-600">Jamón: {spot.jamonScore}/5</span>
                </div>
                <p className="text-sm text-gray-600">{spot.address}</p>
                <p className="text-sm text-amber-700 font-medium mt-1">{spot.priceRange}</p>
                {spot.jamonTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {spot.jamonTypes.map((type) => (
                      <span key={type} className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                )}
                {spot.highlights.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-600">
                    {spot.highlights.slice(0, 2).map((h, i) => (
                      <li key={i}>• {h}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-2 pt-2 border-t text-xs text-gray-400">
                  {spot.reviews} reviews • via {spot.source}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Bottom sheet with selected spot details */}
      {selectedSpot && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-2xl p-4 max-h-[40vh] overflow-y-auto">
          <button
            onClick={() => setSelectedSpot(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold text-amber-900">{selectedSpot.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={selectedSpot.jamonScore} />
            <span className="text-amber-700 font-semibold">{selectedSpot.jamonScore}/5 Jamón Score</span>
          </div>
          <p className="text-gray-600 text-sm mt-1">{selectedSpot.address}</p>
          <p className="text-amber-700 font-medium">{selectedSpot.priceRange}</p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {selectedSpot.jamonTypes.map((type) => (
              <span key={type} className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded">
                {type}
              </span>
            ))}
          </div>
          
          {selectedSpot.highlights.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700 text-sm">Highlights:</h4>
              <ul className="text-sm text-gray-600 mt-1">
                {selectedSpot.highlights.map((h, i) => (
                  <li key={i}>• {h}</li>
                ))}
              </ul>
            </div>
          )}
          
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.lat},${selectedSpot.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full bg-amber-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            Get Directions 🚗
          </a>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <span>🍖</span>
          <span className="text-gray-600">Jamón spot</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span className="text-gray-600">Your location</span>
        </div>
      </div>
    </div>
  )
}
