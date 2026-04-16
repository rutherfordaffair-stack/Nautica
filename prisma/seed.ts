import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌊 Kòmanse seed baz done...')

  // Create demo users
  const password = await bcrypt.hash('demo1234', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'jean@nautica.com' },
    update: {},
    create: {
      name: 'Jean Pierre',
      email: 'jean@nautica.com',
      password,
      bio: 'Marin eksperyanse ak 15 ane eksperyans sou dlo.',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'marie@nautica.com' },
    update: {},
    create: {
      name: 'Marie Dupont',
      email: 'marie@nautica.com',
      password,
    },
  })

  // Create sample boats
  const boats = [
    {
      title: 'Magnifik Katamaran 45 pye — Caraïbes',
      description: 'Yon katamaran modèn ak ekipman konplè. Pafè pou yon vwayaj an fanmi oubyen ant zanmi. Kabinn prive, kokin konplè, ak yon espas sallon kote ou ka relaks.',
      type: 'CATAMARAN' as const,
      capacity: 8,
      length: 45,
      year: 2020,
      make: 'Fountaine Pajot',
      model: 'Elba 45',
      pricePerDay: 850,
      pricePerHour: 150,
      images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80'],
      amenities: ['GPS Navigation', 'Glacière', 'Cuisine de bord', 'Douche', 'Équipement de plongée'],
      country: 'Martinique',
      region: 'Le Marin',
      city: 'Le Marin',
      marina: 'Marina du Marin',
      cancellationPolicy: 'FLEXIBLE' as const,
      ownerId: user1.id,
    },
    {
      title: 'Vwayè Klassik 36 pye — Méditerranée',
      description: 'Bato vwayè klassik pou yon eksperyans otantik sou Méditerranée. Ekipman sekirite konplè, GPS, ak radio VHF. Pwopriyetè disponib pou ba ou konsèy.',
      type: 'SAILBOAT' as const,
      capacity: 6,
      length: 36,
      year: 2018,
      make: 'Jeanneau',
      model: 'Sun Odyssey 36',
      pricePerDay: 450,
      pricePerHour: 80,
      images: ['https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80'],
      amenities: ['GPS Navigation', 'Radio VHF', 'Gilet de sauvetage', 'Ancre'],
      country: 'France',
      region: 'Provence-Alpes-Côte d\'Azur',
      city: 'Nice',
      marina: 'Port de Plaisance',
      cancellationPolicy: 'MODERATE' as const,
      ownerId: user1.id,
    },
    {
      title: 'Yacht Liks 55 pye — Côte d\'Azur',
      description: 'Eksperyans yachting liks nan Côte d\'Azur. Pon prive, salon eksterye, ak vue panoramik. Idyal pou fèt oswa séjou romantik.',
      type: 'YACHT' as const,
      capacity: 10,
      length: 55,
      year: 2022,
      make: 'Azimut',
      model: 'S6',
      pricePerDay: 2200,
      pricePerHour: 400,
      images: ['https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80'],
      amenities: ['GPS Navigation', 'Climatisation', 'Glacière', 'Douche', 'Bluetooth/Stéréo', 'Wi-Fi'],
      country: 'France',
      region: 'Provence-Alpes-Côte d\'Azur',
      city: 'Cannes',
      marina: 'Port Pierre Canto',
      cancellationPolicy: 'STRICT' as const,
      ownerId: user2.id,
    },
    {
      title: 'Speedboat 28 pye — Haiti, Côtes des Arcadins',
      description: 'Bato rapid pou yon jounen eksizan sou bèl plaj Arcadins. Ekipman snorkeling inclus, glacière, epi koufyaj.',
      type: 'SPEEDBOAT' as const,
      capacity: 8,
      length: 28,
      year: 2019,
      pricePerDay: 280,
      pricePerHour: 60,
      images: ['https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=800&q=80'],
      amenities: ['Glacière', 'Équipement de plongée', 'Gilet de sauvetage'],
      country: 'Haiti',
      region: 'Artibonite',
      city: 'Saint-Marc',
      marina: 'Côtes des Arcadins',
      cancellationPolicy: 'FLEXIBLE' as const,
      ownerId: user2.id,
    },
  ]

  for (const boat of boats) {
    await prisma.boat.create({ data: boat })
  }

  console.log('✅ Seed fini! Baz done prè.')
  console.log('👤 Kont demo: jean@nautica.com / marie@nautica.com | Modpas: demo1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
