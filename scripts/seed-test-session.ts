import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding test events...')
  
  const testEvent = await prisma.event.upsert({
    where: { albumId: 'TEST-WEDDING-2026' },
    update: {},
    create: {
      name: 'Shruti & Rahul Wedding',
      date: '12/12/2026',
      type: 'Wedding',
      photoCount: 450,
      qrCode: 'SS-TEST-001',
      albumId: 'TEST-WEDDING-2026',
      isFaceProcessed: true,
    },
  })

  console.log('Created test event:', testEvent.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
