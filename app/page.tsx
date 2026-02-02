'use client'

import { useState, useEffect } from 'react'

const ALL_SPOTS = [
  { id: '1', name: 'Selanne Steak Tavern', address: 'San Juan Capistrano, CA', score: 4, price: '$$$$', types: ['Jamón Ibérico'], lat: 33.4936, lng: -117.6628 },
  { id: '2', name: 'Café Sevilla', address: 'Costa Mesa, CA', score: 4, price: '$$$', types: ['Jamón Serrano', 'Jamón Ibérico'], lat: 33.6846, lng: -117.8262 },
  { id: '3', name: 'Bazaar by José Andrés', address: 'Los Angeles, CA', score: 5, price: '$$$$', types: ['Jamón Ibérico 5J'], lat: 34.0896, lng: -118.3772 },
  { id: '4', name: 'AOC Wine Bar', address: 'Los Angeles, CA', score: 5, price: '$$$$', types: ['Jamón Ibérico de Bellota'], lat: 34.0739, lng: -118.3774 },
  { id: '5', name: 'The Winery Restaurant', address: 'Tustin, CA', score: 4, price: '$$$$', types: ['Jamón Serrano'], lat: 33.6673, lng: -117.8554 },
  { id: '6', name: 'Taberna Arros Y Vi', address: 'Venice, CA', score: 5, price: '$$$', types: ['Jamón Ibérico', 'Lomo'], lat: 34.0417, lng: -118.5139 },
  { id: '7', name: 'El Adobe de Capistrano', address: 'San Juan Capistrano, CA', score: 3, price: '$$', types: ['Jamón Serrano'], lat: 33.5017, lng: -117.6621 },
  { id: '8', name: 'Bellota', address: 'San Francisco, CA', score: 5, price: '$$$$', types: ['Jamón Ibérico de Bellota'], lat: 37.7749, lng: -122.3994 },
  { id: '9', name: 'Café Sevilla San Diego', address: 'San Diego, CA', score: 4, price: '$$$', types: ['Jamón Serrano', 'Jamón Ibérico'], lat: 32.7157, lng: -117.1611 },
]

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function Home() {
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude)
          setUserLng(pos.coords.longitude)
          setLoading(false)
        },
        () => {
          // Default to San Juan Capistrano
          setUserLat(33.5017)
          setUserLng(-117.6625)
          setLoading(false)
        },
        { timeout: 5000 }
      )
    } else {
      setUserLat(33.5017)
      setUserLng(-117.6625)
      setLoading(false)
    }
  }, [])

  // Sort spots by distance if we have user location
  const spots = userLat && userLng
    ? ALL_SPOTS.map(s => ({ ...s, distance: getDistance(userLat, userLng, s.lat, s.lng) }))
        .sort((a, b) => a.distance - b.distance)
    : ALL_SPOTS.map(s => ({ ...s, distance: 0 }))

  const mapUrl = userLat && userLng
    ? `https://maps.google.com/maps?q=${userLat},${userLng}&z=10&output=embed`
    : `https://maps.google.com/maps?q=33.5,-117.6&z=9&output=embed`

  return (
    <div style={{ fontFamily: '-apple-system, sans-serif', background: '#fffbeb', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#92400e', color: 'white', padding: 16, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>🍖 Jamón Locator</h1>
        <p style={{ margin: '4px 0 0', color: '#fef3c7', fontSize: 14 }}>
          {loading ? 'Finding your location...' : `${spots.length} spots nearby`}
        </p>
      </header>

      {/* Map */}
      <div style={{ height: 200, background: '#e5e5e5' }}>
        <iframe
          src={mapUrl}
          style={{ width: '100%', height: '100%', border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Spots List */}
      <main style={{ padding: 16 }}>
        {spots.map((spot) => (
          <div key={spot.id} style={{
            background: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #fcd34d'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 18, color: '#78350f' }}>{spot.name}</div>
                <div style={{ color: '#666', fontSize: 14, marginTop: 2 }}>{spot.address}</div>
                {spot.distance > 0 && (
                  <div style={{ color: '#92400e', fontSize: 13, marginTop: 2 }}>
                    📍 {spot.distance.toFixed(1)} miles away
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#d97706' }}>{spot.score}/5</div>
                <div style={{ color: '#666', fontSize: 14 }}>{spot.price}</div>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              {spot.types.map((t) => (
                <span key={t} style={{
                  display: 'inline-block',
                  background: '#fef3c7',
                  color: '#92400e',
                  fontSize: 12,
                  padding: '4px 8px',
                  borderRadius: 12,
                  marginRight: 4,
                  marginBottom: 4
                }}>{t}</span>
              ))}
            </div>
            <a
              href={`https://maps.apple.com/?daddr=${spot.lat},${spot.lng}`}
              style={{
                display: 'block',
                background: '#d97706',
                color: 'white',
                textAlign: 'center',
                padding: 12,
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 600,
                marginTop: 12
              }}
            >
              Get Directions 📍
            </a>
          </div>
        ))}
      </main>
    </div>
  )
}
