// Server component - no 'use client'

const SPOTS = [
  { id: '1', name: 'Selanne Steak Tavern', address: 'San Juan Capistrano', score: 4, price: '$$$$', types: ['Jamón Ibérico'], lat: 33.4936, lng: -117.6628 },
  { id: '2', name: 'Café Sevilla', address: 'Costa Mesa', score: 4, price: '$$$', types: ['Jamón Serrano', 'Jamón Ibérico'], lat: 33.6846, lng: -117.8262 },
  { id: '3', name: 'Bazaar by José Andrés', address: 'Los Angeles', score: 5, price: '$$$$', types: ['Jamón Ibérico 5J'], lat: 34.0896, lng: -118.3772 },
  { id: '4', name: 'AOC Wine Bar', address: 'Los Angeles', score: 5, price: '$$$$', types: ['Jamón Ibérico de Bellota'], lat: 34.0739, lng: -118.3774 },
  { id: '5', name: 'The Winery Restaurant', address: 'Tustin', score: 4, price: '$$$$', types: ['Jamón Serrano'], lat: 33.6673, lng: -117.8554 },
  { id: '6', name: 'Taberna Arros Y Vi', address: 'Venice', score: 5, price: '$$$', types: ['Jamón Ibérico', 'Lomo'], lat: 34.0417, lng: -118.5139 },
  { id: '7', name: 'El Adobe de Capistrano', address: 'San Juan Capistrano', score: 3, price: '$$', types: ['Jamón Serrano'], lat: 33.5017, lng: -117.6621 },
]

export default function Home() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>🍖 Jamón Locator</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #fffbeb; min-height: 100vh; }
          header { background: #92400e; color: white; padding: 16px; position: sticky; top: 0; }
          h1 { font-size: 24px; }
          .subtitle { color: #fef3c7; font-size: 14px; margin-top: 4px; }
          main { padding: 16px; }
          .card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #fcd34d; }
          .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
          .name { font-weight: bold; font-size: 18px; color: #78350f; }
          .address { color: #666; font-size: 14px; margin-top: 2px; }
          .score { font-size: 24px; font-weight: bold; color: #d97706; }
          .price { color: #666; font-size: 14px; }
          .types { margin-top: 8px; }
          .tag { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; padding: 4px 8px; border-radius: 12px; margin-right: 4px; margin-bottom: 4px; }
          .btn { display: block; background: #d97706; color: white; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 12px; }
          .btn:active { background: #b45309; }
        `}} />
      </head>
      <body>
        <header>
          <h1>🍖 Jamón Locator</h1>
          <div className="subtitle">{SPOTS.length} spots in Southern California</div>
        </header>
        <main>
          {SPOTS.sort((a, b) => b.score - a.score).map((spot) => (
            <div key={spot.id} className="card">
              <div className="card-header">
                <div>
                  <div className="name">{spot.name}</div>
                  <div className="address">{spot.address}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="score">{spot.score}/5</div>
                  <div className="price">{spot.price}</div>
                </div>
              </div>
              <div className="types">
                {spot.types.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <a 
                className="btn" 
                href={`https://maps.apple.com/?daddr=${spot.lat},${spot.lng}`}
              >
                Get Directions 📍
              </a>
            </div>
          ))}
        </main>
      </body>
    </html>
  )
}
