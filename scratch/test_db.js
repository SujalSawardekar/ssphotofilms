const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const contents = await prisma.cmsContent.findMany();
    console.log("=== CMS CONTENT ===");
    for (const c of contents) {
      console.log(`${c.key}: ${c.value}`);
    }
  } catch (error) {
    console.error("Failed to query DB!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
