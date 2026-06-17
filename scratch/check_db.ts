import prisma from '../lib/prisma';

async function checkDb() {
  const contents = await prisma.cmsContent.findMany();
  console.log("=== CMS CONTENT TABLE ===");
  for (const c of contents) {
    console.log(`[${c.key}]:`, JSON.stringify(c.value));
  }
}

checkDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

