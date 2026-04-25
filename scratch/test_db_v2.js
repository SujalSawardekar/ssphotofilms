const { PrismaClient } = require('@prisma/client');

async function main() {
  // Trying port 6543 with pgbouncer=true
  const url = "postgresql://postgres.kpyjzzvyrpnoeygtxvvr:YyZ%25bfY58%2BUxn%40D@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  console.log("Testing with URL:", url.replace(/:[^:@]+@/, ":****@"));
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });
  
  try {
    console.log("Attempting to connect...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Connection successful:", result);
  } catch (error) {
    console.error("Connection failed!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
