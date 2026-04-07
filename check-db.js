require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const now = new Date();
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('--- SYSTEM TIME ---');
    console.log(`Local Now: ${now.toLocaleString()}`);
    console.log(`UTC Now:   ${now.toISOString()}`);
    
    console.log('\n--- RAW BOOKING DATA ---');
    bookings.forEach(b => {
      let diffHours = "N/A";
      try {
        const eventTime = new Date(b.eventDate).getTime();
        diffHours = ((eventTime - now.getTime()) / (1000 * 60 * 60)).toFixed(2);
      } catch(e) {}
      
      console.log(`ID: ${b.id}`);
      console.log(`  Client: ${b.clientName}`);
      console.log(`  Date String in DB: "${b.eventDate}"`);
      console.log(`  Status: ${b.status}`);
      console.log(`  ReminderSent: ${b.reminderSent}`);
      console.log(`  Calculated Diff (Hours): ${diffHours}`);
      console.log('-------------------------');
    });
  } catch (err) {
    console.error('DIAGNOSTIC ERROR:', err.message);
    if (err.message.includes('reminderSent')) {
      console.log('>>> ERROR: reminderSent field MISSING in database. You must run "npx prisma db push".');
    }
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

check();
