'use client'

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = icon

interface JamonSpot {
  id: string
  name: string
  lat: number
  lng: number
  jamonScore: number
  jamonTypes: string[]
  priceRange: string
  address: string
}

interface MapViewProps {
  center: { lat: number; lng: number }
  spots: JamonSpot[]
}

export default function MapView({ center, spots }: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      
      {/* User location */}
      <CircleMarker 
        center={[center.lat, center.lng]} 
        radius={8}
        pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.9, weight: 2 }}
      >
        <Popup>📍 You are here</Popup>
      </CircleMarker>

      {/* Jamon spots */}
      {spots.map((spot) => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong style={{ color: '#92400e' }}>{spot.name}</strong>
              <div style={{ margin: '4px 0' }}>
                {'⭐'.repeat(spot.jamonScore)} {spot.jamonScore}/5
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>{spot.address}</div>
              <div style={{ marginTop: 4 }}>
                {spot.jamonTypes.map((t) => (
                  <span key={t} style={{
                    display: 'inline-block',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: 11,
                    padding: '2px 6px',
                    borderRadius: 4,
                    marginRight: 4
                  }}>{t}</span>
                ))}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: 8,
                  background: '#d97706',
                  color: 'white',
                  textAlign: 'center',
                  padding: 8,
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Directions 🚗
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
