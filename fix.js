const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const jobs = await prisma.application.findMany({ where: { companyName: 'Company' } });
  for (const job of jobs) {
    if (job.position.includes(':')) {
      const parts = job.position.split(':');
      await prisma.application.update({
        where: { id: job.id },
        data: { companyName: parts[0].trim(), position: parts.slice(1).join(':').trim() }
      });
      console.log('Updated', parts[0]);
    }
  }
}
run();
