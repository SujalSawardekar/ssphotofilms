
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { installments: true },
      orderBy: { createdAt: 'desc' }
    });
    console.log("Success! Found", bookings.length, "bookings.");
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
