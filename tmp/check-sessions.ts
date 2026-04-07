import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const events = await prisma.event.findMany({
    where: { 
      OR: [
        { aiStatus: 'Processing' },
        { aiStatus: 'Pending' }
      ]
    },
    select: {
      id: true,
      name: true,
      aiStatus: true,
      driveLink: true,
      zipPath: true,
      currentProgress: true,
      totalPhotos: true
    }
  })
  console.log(JSON.stringify(events, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
