import type { Hotel } from '@/types'

const hotelNames = [
  'Pestana Palace Lisboa', 'Tivoli Avenida Liberdade', 'Four Seasons Ritz', 'Palácio Estoril',
  'Hotel Infante Sagres', 'The Yeatman Porto', 'Vila Vita Parc', 'Bela Vista Hotel & Spa',
  'Convento do Espinheiro', 'Pousada Castelo Óbidos', 'Palácio Belmonte', 'Casa da Calçada',
  'L\'And Vineyards', 'Six Senses Douro Valley', 'Penha Longa Resort', 'Martinhal Sagres',
  'Quinta da Casa Branca', 'Reid\'s Palace Madeira', 'Vidamar Resort Madeira', 'Pedras Salgadas',
  'Hotel Ritz Madrid', 'W Barcelona', 'Hotel Arts Barcelona', 'Mandarin Oriental Barcelona',
  'Parador de Granada', 'Hotel Alfonso XIII Sevilla', 'Hospes Palacio de los Patos', 'Aman Tokyo',
  'Gran Hotel Miramar Málaga', 'Hotel María Cristina San Sebastián', 'Parador de Santiago',
  'Hotel Único Madrid', 'Cotton House Hotel Barcelona', 'El Palace Barcelona',
  'Hotel Danieli Venezia', 'Belmond Villa San Michele', 'Four Seasons Firenze', 'Hotel de Russie Roma',
  'Grand Hotel Tremezzo', 'Belmond Hotel Caruso', 'Aman Venice', 'Hotel Hassler Roma',
  'Palazzo Avino Ravello', 'Il San Pietro Positano', 'Belmond Splendido Portofino',
  'Villa d\'Este Como', 'JK Place Firenze', 'Portrait Roma', 'Hotel Excelsior Venezia',
  'Le Bristol Paris', 'Hôtel Plaza Athénée', 'Ritz Paris', 'Le Meurice Paris',
  'Hotel du Cap-Eden-Roc', 'La Réserve Paris', 'Château de la Messardière', 'Les Airelles Courchevel',
  'Hôtel de Crillon', 'Four Seasons George V', 'Château Saint-Martin', 'La Bastide de Gordes',
  'Hotel Adlon Kempinski Berlin', 'Bayerischer Hof München', 'Hotel Sacher Wien',
  'Park Hyatt Vienna', 'Schloss Elmau', 'Brenners Park-Hotel Baden-Baden',
  'Amanzoe Greece', 'Grace Hotel Santorini', 'Canaves Oia Santorini', 'Costa Navarino',
  'Four Seasons Bosphorus', 'Çırağan Palace Kempinski', 'Mandarin Oriental Bodrum',
  'Claridge\'s London', 'The Savoy London', 'The Connaught London', 'Gleneagles Scotland',
  'Ashford Castle Ireland', 'The Shelbourne Dublin', 'Cliveden House', 'Chewton Glen',
  'Badrutt\'s Palace St. Moritz', 'The Dolder Grand Zürich', 'Beau-Rivage Palace Lausanne',
  'Hotel & Spa Nira Alpina', 'Hotel & Villa Honegg', 'Grand Hotel Stockholm',
  'Nobis Hotel Copenhagen', 'Arctic TreeHouse Hotel', 'Juvet Landscape Hotel'
]

const locations = [
  { city: 'Lisboa', country: 'Portugal' },
  { city: 'Porto', country: 'Portugal' },
  { city: 'Algarve', country: 'Portugal' },
  { city: 'Sintra', country: 'Portugal' },
  { city: 'Madeira', country: 'Portugal' },
  { city: 'Évora', country: 'Portugal' },
  { city: 'Óbidos', country: 'Portugal' },
  { city: 'Cascais', country: 'Portugal' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Sevilla', country: 'Spain' },
  { city: 'Granada', country: 'Spain' },
  { city: 'Málaga', country: 'Spain' },
  { city: 'San Sebastián', country: 'Spain' },
  { city: 'Valencia', country: 'Spain' },
  { city: 'Roma', country: 'Italy' },
  { city: 'Firenze', country: 'Italy' },
  { city: 'Venezia', country: 'Italy' },
  { city: 'Milano', country: 'Italy' },
  { city: 'Amalfi Coast', country: 'Italy' },
  { city: 'Como', country: 'Italy' },
  { city: 'Portofino', country: 'Italy' },
  { city: 'Paris', country: 'France' },
  { city: 'Nice', country: 'France' },
  { city: 'Cannes', country: 'France' },
  { city: 'Provence', country: 'France' },
  { city: 'Courchevel', country: 'France' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'München', country: 'Germany' },
  { city: 'Wien', country: 'Austria' },
  { city: 'Zürich', country: 'Switzerland' },
  { city: 'London', country: 'UK' },
  { city: 'Dublin', country: 'Ireland' },
  { city: 'Santorini', country: 'Greece' },
  { city: 'Istanbul', country: 'Turkey' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Copenhagen', country: 'Denmark' },
]

const amenities = [
  'Spa', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Concierge',
  'WiFi', 'Parking', 'Airport Transfer', 'Business Center', 'Kids Club',
  'Beach Access', 'Golf Course', 'Tennis Court', 'Rooftop Terrace',
  'Wine Cellar', 'Helipad', 'Private Beach', 'Michelin Restaurant'
]

function getRandomAmenities(): string[] {
  const count = Math.floor(Math.random() * 8) + 5
  const shuffled = [...amenities].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateHotelId(): string {
  return `htl_${Math.random().toString(36).substring(2, 11)}`
}

export const hotels: Hotel[] = hotelNames.map((name, index) => {
  const location = locations[index % locations.length]
  const totalRooms = Math.floor(Math.random() * 200) + 50
  const occupancyRate = Math.floor(Math.random() * 40) + 55
  const availableRooms = Math.floor(totalRooms * (1 - occupancyRate / 100))

  return {
    id: generateHotelId(),
    name,
    location: location.city,
    country: location.country,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
    totalRooms,
    availableRooms,
    occupancyRate,
    pricePerNight: Math.floor(Math.random() * 800) + 150,
    amenities: getRandomAmenities(),
    imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/800/600`
  }
})

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find(hotel => hotel.id === id)
}

export function getHotelsByCountry(country: string): Hotel[] {
  return hotels.filter(hotel => hotel.country === country)
}

export function searchHotels(query: string): Hotel[] {
  const lowerQuery = query.toLowerCase()
  return hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(lowerQuery) ||
    hotel.location.toLowerCase().includes(lowerQuery) ||
    hotel.country.toLowerCase().includes(lowerQuery)
  )
}
