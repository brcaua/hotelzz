import type { Guest } from '@/types'

const firstNames = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Sofia', 'Miguel', 'Beatriz',
  'André', 'Inês', 'Francisco', 'Mariana', 'Diogo', 'Catarina', 'Rui', 'Teresa',
  'Marco', 'Isabella', 'Alessandro', 'Giulia', 'Pierre', 'Sophie', 'Hans', 'Elena',
  'James', 'Emma', 'William', 'Olivia', 'Lucas', 'Charlotte', 'Henrik', 'Astrid',
  'Paolo', 'Francesca', 'Antonio', 'Carmen', 'Nikolai', 'Svetlana', 'Yuki', 'Sakura'
]

const lastNames = [
  'Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins',
  'Fernandes', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Almeida', 'Ribeiro', 'Pinto',
  'Rossi', 'Bianchi', 'Romano', 'Colombo', 'Ferrari', 'Esposito', 'Ricci', 'Marino',
  'Müller', 'Schmidt', 'Weber', 'Wagner', 'Fischer', 'Becker', 'Hoffmann', 'Schäfer',
  'Martin', 'Bernard', 'Thomas', 'Robert', 'Dubois', 'Moreau', 'Laurent', 'Simon',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson'
]

const countries = [
  'Portugal', 'Spain', 'Italy', 'France', 'Germany', 'UK', 'USA', 'Brazil',
  'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark',
  'Ireland', 'Japan', 'Australia', 'Canada', 'Poland'
]

const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'proton.me']

const phonePrefixes: Record<string, string> = {
  'Portugal': '+351',
  'Spain': '+34',
  'Italy': '+39',
  'France': '+33',
  'Germany': '+49',
  'UK': '+44',
  'USA': '+1',
  'Brazil': '+55',
  'Netherlands': '+31',
  'Belgium': '+32',
  'Switzerland': '+41',
  'Austria': '+43',
  'Sweden': '+46',
  'Norway': '+47',
  'Denmark': '+45',
  'Ireland': '+353',
  'Japan': '+81',
  'Australia': '+61',
  'Canada': '+1',
  'Poland': '+48'
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function generateGuestId(index: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let result = ''
  let seed = index + 1
  for (let i = 0; i < 9; i++) {
    result += chars[Math.floor(seededRandom(seed + i) * chars.length)]
  }
  return `gst_${result}`
}

function generatePhone(country: string, seed: number): string {
  const prefix = phonePrefixes[country] || '+1'
  const number = 100000000 + Math.floor(seededRandom(seed) * 900000000)
  return `${prefix} ${number.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`
}

export const guests: Guest[] = Array.from({ length: 100 }, (_, index) => {
  const seed1 = index * 7 + 1
  const seed2 = index * 13 + 2
  const seed3 = index * 17 + 3
  
  const firstName = firstNames[Math.floor(seededRandom(seed1) * firstNames.length)]
  const lastName = lastNames[Math.floor(seededRandom(seed2) * lastNames.length)]
  const country = countries[Math.floor(seededRandom(seed3) * countries.length)]
  const domain = domains[index % domains.length]

  return {
    id: generateGuestId(index),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    phone: generatePhone(country, index * 23),
    country,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    totalStays: (index % 15) + 1,
    vipStatus: index % 7 === 0
  }
})

export function getGuestById(id: string): Guest | undefined {
  return guests.find(guest => guest.id === id)
}

export function getVipGuests(): Guest[] {
  return guests.filter(guest => guest.vipStatus)
}

export function searchGuests(query: string): Guest[] {
  const lowerQuery = query.toLowerCase()
  return guests.filter(guest =>
    guest.name.toLowerCase().includes(lowerQuery) ||
    guest.email.toLowerCase().includes(lowerQuery) ||
    guest.country.toLowerCase().includes(lowerQuery)
  )
}
