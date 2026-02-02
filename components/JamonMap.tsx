'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with standard markers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = defaultIcon

export interface JamonSpot {
  id: string
  name: string
  lat: number
  lng: number
  rating: number
  reviews: number
  jamonScore: number
  jamonTypes: string[]
  priceRange: string
  address: string
  highlights: string[]
  source: string
  distance?: number
}

function MapRecenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap()
  useEffect(() => {
    map.setView([center.lat, center.lng], 11)
  }, [center, map])
  return null
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= rating ? '#d97706' : '#d1d5db' }}>
          ★
        </span>
      ))}
    </span>
  )
}

interface JamonMapProps {
  center: { lat: number; lng: number }
}

export default function JamonMap({ center }: JamonMapProps) {
  const [spots, setSpots] = useState<JamonSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSpots() {
      try {
        console.log('Fetching spots for:', center)
        const res = await fetch(`/api/jamon?lat=${center.lat}&lng=${center.lng}&radius=100`)
        const data = await res.json()
        console.log('Got spots:', data)
        setSpots(data.spots || [])
        if (data.spots?.length === 0) {
          setError('No jamón spots found nearby')
        }
      } catch (err) {
        console.error('Failed to fetch spots:', err)
        setError('Failed to load spots')
      } finally {
        setLoading(false)
      }
    }
    fetchSpots()
  }, [center])

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(to bottom, rgba(120, 53, 15, 0.9), transparent)',
        padding: '16px',
        paddingBottom: '48px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          🍖 Jamón Locator
        </h1>
        <p style={{ color: '#fef3c7', fontSize: '14px', margin: '4px 0 0 0' }}>Find the finest jamón near you</p>
      </div>

      {/* Status badge */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '16px',
        zIndex: 1000,
        background: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '14px'
      }}>
        {loading ? (
          <span>🔍 Searching...</span>
        ) : error ? (
          <span style={{ color: '#dc2626' }}>{error}</span>
        ) : (
          <span style={{ color: '#92400e', fontWeight: 600 }}>🍖 {spots.length} spots found</span>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={center} />
        
        {/* User location */}
        <CircleMarker 
          center={[center.lat, center.lng]} 
          radius={10}
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.8 }}
        >
          <Popup>📍 Your location</Popup>
        </CircleMarker>

        {/* Jamon spots */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#78350f' }}>{spot.name}</h3>
                <div style={{ marginBottom: '4px' }}>
                  <RatingStars rating={spot.jamonScore} />
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                    Jamón: {spot.jamonScore}/5
                  </span>
                </div>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{spot.address}</p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#92400e', fontWeight: 500 }}>{spot.priceRange}</p>
                {spot.distance && (
                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                    📍 {spot.distance.toFixed(1)} miles away
                  </p>
                )}
                <div style={{ marginTop: '8px' }}>
                  {spot.jamonTypes.map((type) => (
                    <span key={type} style={{
                      display: 'inline-block',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginRight: '4px',
                      marginBottom: '4px'
                    }}>
                      {type}
                    </span>
                  ))}
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    marginTop: '8px',
                    background: '#d97706',
                    color: 'white',
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  Get Directions 🚗
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '12px'
      }}>
        <div>📍 = You</div>
        <div>📌 = Jamón spot</div>
      </div>
    </div>
  )
}
