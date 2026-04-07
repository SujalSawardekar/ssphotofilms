import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding administrative user...');

  const adminEmail = 'admin@ss.com';
  const adminPassword = '12345'; // Official password as requested by user

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword }, // Update password if user already exists
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Shreyas Sawardekar',
      role: 'admin',
    },
  });

  console.log('-----------------------------');

  console.log('Seeding test events...');

  await prisma.event.upsert({
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
  });

  console.log('Created test event: Shruti & Rahul Wedding');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
