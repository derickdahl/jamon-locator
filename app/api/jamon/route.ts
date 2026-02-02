import { NextRequest, NextResponse } from 'next/server'

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
}

// Seed data - famous jamon spots across California and Spain
// In production, this would come from Yelp API with "jamon" keyword search
const JAMON_DATABASE: JamonSpot[] = [
  // Orange County
  {
    id: '1',
    name: 'Café Sevilla',
    lat: 33.6846,
    lng: -117.8262,
    rating: 4.3,
    reviews: 842,
    jamonScore: 4,
    jamonTypes: ['Jamón Serrano', 'Jamón Ibérico'],
    priceRange: '$$$',
    address: '1870 Harbor Blvd, Costa Mesa, CA',
    highlights: ['Authentic Spanish tapas', 'Hand-carved jamón at the bar', 'Flamenco shows'],
    source: 'Yelp',
  },
  {
    id: '2',
    name: 'Cha Cha\'s Latin Kitchen',
    lat: 33.5427,
    lng: -117.7854,
    rating: 4.2,
    reviews: 1205,
    jamonScore: 3,
    jamonTypes: ['Jamón Serrano'],
    priceRange: '$$',
    address: '110 W Birch St, Brea, CA',
    highlights: ['Jamón wrapped dates', 'Great happy hour'],
    source: 'Yelp',
  },
  {
    id: '3',
    name: 'Bosscat Kitchen & Libations',
    lat: 33.6595,
    lng: -117.9988,
    rating: 4.4,
    reviews: 2100,
    jamonScore: 3,
    jamonTypes: ['Country Ham', 'Prosciutto'],
    priceRange: '$$',
    address: '4647 MacArthur Blvd, Newport Beach, CA',
    highlights: ['Whiskey bar', 'Charcuterie boards'],
    source: 'Yelp',
  },
  // Los Angeles
  {
    id: '4',
    name: 'Bar Amá',
    lat: 34.0469,
    lng: -118.2362,
    rating: 4.2,
    reviews: 1567,
    jamonScore: 4,
    jamonTypes: ['Jamón Serrano'],
    priceRange: '$$',
    address: '118 W 4th St, Los Angeles, CA',
    highlights: ['Tex-Mex meets Spanish', 'House-cured meats'],
    source: 'Yelp',
  },
  {
    id: '5',
    name: 'AOC Wine Bar',
    lat: 34.0739,
    lng: -118.3774,
    rating: 4.5,
    reviews: 2341,
    jamonScore: 5,
    jamonTypes: ['Jamón Ibérico de Bellota', 'Jamón Serrano'],
    priceRange: '$$$$',
    address: '8700 W 3rd St, Los Angeles, CA',
    highlights: ['James Beard winner', 'Exceptional charcuterie', 'Perfect wine pairing'],
    source: 'Yelp',
  },
  {
    id: '6',
    name: 'Bazaar by José Andrés',
    lat: 34.0896,
    lng: -118.3772,
    rating: 4.4,
    reviews: 3102,
    jamonScore: 5,
    jamonTypes: ['Jamón Ibérico 5J', 'Jamón Ibérico de Bellota'],
    priceRange: '$$$$',
    address: '465 S La Cienega Blvd, Los Angeles, CA',
    highlights: ['World-renowned chef', 'Theatrically sliced jamón', 'Molecular gastronomy'],
    source: 'Yelp',
  },
  {
    id: '7',
    name: 'Taberna Arros Y Vi',
    lat: 34.0417,
    lng: -118.5139,
    rating: 4.5,
    reviews: 876,
    jamonScore: 5,
    jamonTypes: ['Jamón Ibérico', 'Jamón Serrano', 'Lomo Ibérico'],
    priceRange: '$$$',
    address: '1403 Abbot Kinney Blvd, Venice, CA',
    highlights: ['Authentic Spanish', 'Paella specialists', 'Hand-carved jamón board'],
    source: 'Yelp',
  },
  // San Diego
  {
    id: '8',
    name: 'Café Sevilla San Diego',
    lat: 32.7157,
    lng: -117.1611,
    rating: 4.1,
    reviews: 1456,
    jamonScore: 4,
    jamonTypes: ['Jamón Serrano', 'Jamón Ibérico'],
    priceRange: '$$$',
    address: '353 5th Ave, San Diego, CA',
    highlights: ['Gaslamp location', 'Tapas bar', 'Live flamenco'],
    source: 'Yelp',
  },
  {
    id: '9',
    name: 'Barrio Star',
    lat: 32.7503,
    lng: -117.1303,
    rating: 4.3,
    reviews: 987,
    jamonScore: 3,
    jamonTypes: ['Jamón Serrano'],
    priceRange: '$$',
    address: '2706 5th Ave, San Diego, CA',
    highlights: ['Modern Mexican-Spanish', 'Great cocktails'],
    source: 'Yelp',
  },
  // San Francisco
  {
    id: '10',
    name: 'Bellota',
    lat: 37.7749,
    lng: -122.3994,
    rating: 4.5,
    reviews: 1823,
    jamonScore: 5,
    jamonTypes: ['Jamón Ibérico de Bellota', 'Paleta Ibérica', 'Lomo'],
    priceRange: '$$$$',
    address: '888 Brannan St, San Francisco, CA',
    highlights: ['Named after acorns (bellota)', 'Spanish fine dining', 'Exceptional cured meats'],
    source: 'Yelp',
  },
  {
    id: '11',
    name: 'Contigo',
    lat: 37.7529,
    lng: -122.4117,
    rating: 4.4,
    reviews: 1234,
    jamonScore: 4,
    jamonTypes: ['Jamón Serrano', 'Jamón Ibérico'],
    priceRange: '$$$',
    address: '1320 Castro St, San Francisco, CA',
    highlights: ['Noe Valley gem', 'Spanish-Catalan cuisine', 'Housemade charcuterie'],
    source: 'Yelp',
  },
  // More OC spots near San Juan Capistrano
  {
    id: '12',
    name: 'Javier\'s Cantina',
    lat: 33.6189,
    lng: -117.9298,
    rating: 4.0,
    reviews: 2567,
    jamonScore: 3,
    jamonTypes: ['Jamón Serrano'],
    priceRange: '$$$',
    address: '7832 Edinger Ave, Huntington Beach, CA',
    highlights: ['Upscale Mexican', 'Charcuterie options'],
    source: 'Yelp',
  },
  {
    id: '13',
    name: 'The Winery Restaurant',
    lat: 33.6673,
    lng: -117.8554,
    rating: 4.5,
    reviews: 3421,
    jamonScore: 4,
    jamonTypes: ['Prosciutto di Parma', 'Jamón Serrano'],
    priceRange: '$$$$',
    address: '2647 Park Ave, Tustin, CA',
    highlights: ['Award-winning wine list', 'Charcuterie boards', 'Special occasion spot'],
    source: 'Yelp',
  },
  {
    id: '14',
    name: 'Selanne Steak Tavern',
    lat: 33.4936,
    lng: -117.6628,
    rating: 4.6,
    reviews: 1876,
    jamonScore: 4,
    jamonTypes: ['Jamón Ibérico', 'Various cured meats'],
    priceRange: '$$$$',
    address: '31422 Avenida Los Cerritos, San Juan Capistrano, CA',
    highlights: ['Owned by NHL legend Teemu Selanne', 'Premium steakhouse', 'Excellent charcuterie'],
    source: 'Yelp',
  },
  {
    id: '15',
    name: 'El Adobe de Capistrano',
    lat: 33.5017,
    lng: -117.6621,
    rating: 3.9,
    reviews: 2134,
    jamonScore: 3,
    jamonTypes: ['Jamón Serrano'],
    priceRange: '$$',
    address: '31891 Camino Capistrano, San Juan Capistrano, CA',
    highlights: ['Historic building', 'Richard Nixon\'s favorite', 'Classic Mexican'],
    source: 'Yelp',
  },
]

// Calculate distance between two points (Haversine formula)
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '33.5017')
  const lng = parseFloat(searchParams.get('lng') || '-117.6625')
  const radius = parseFloat(searchParams.get('radius') || '50') // miles

  // Filter spots within radius and sort by jamon score then distance
  const nearbySpots = JAMON_DATABASE
    .map((spot) => ({
      ...spot,
      distance: getDistance(lat, lng, spot.lat, spot.lng),
    }))
    .filter((spot) => spot.distance <= radius)
    .sort((a, b) => {
      // Sort by jamon score (descending), then by distance (ascending)
      if (b.jamonScore !== a.jamonScore) {
        return b.jamonScore - a.jamonScore
      }
      return a.distance - b.distance
    })

  return NextResponse.json({
    spots: nearbySpots,
    count: nearbySpots.length,
    searchCenter: { lat, lng },
    radius,
  })
}
