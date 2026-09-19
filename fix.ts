import { PrismaClient } from './generated/prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const connectionString = "postgresql://neondb_owner:npg_UJL3pC0lHNIw@ep-super-tree-b32lu78x-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const jobs = await prisma.application.findMany({ where: { companyName: 'Company' } });
  let count = 0;
  for (const job of jobs) {
    if (job.position.includes(':')) {
      const parts = job.position.split(':');
      await prisma.application.update({
        where: { id: job.id },
        data: { companyName: parts[0].trim(), position: parts.slice(1).join(':').trim() }
      });
      console.log('Updated', parts[0]);
      count++;
    }
  }
  console.log("Total updated:", count);
}
run();
