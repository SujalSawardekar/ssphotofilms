const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test data...');

  const adminEmail = 'admin@ss.com';
  const adminPassword = '12345'; // Final password check for 12345

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword }, // Update password if user already exists
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Shreyas Sawardekar',
      role: 'admin',
    },
  });

  console.log('Admin account checked/created.');

  const albumId = 'TEST-WEDDING-2026';
  await prisma.event.upsert({
    where: { albumId: albumId },
    update: {},
    create: {
      name: 'Shruti & Rahul Wedding',
      date: '12/12/2026',
      type: 'Wedding',
      photoCount: 450,
      qrCode: 'SS-TEST-001',
      albumId: albumId,
      isFaceProcessed: true,
    },
  });

  console.log('Test event "Shruti & Rahul Wedding" created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
