/**
 * Seed script: Creates a demo account for portfolio visitors to try JobTrail.
 * Run once: npx tsx scripts/seed-demo.ts
 *
 * Demo credentials:
 *   Email:    demo@jobtrail.app
 *   Password: Demo1234
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "demo@jobtrail.app";
  const password = "Demo1234";

  // Check if demo account already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("✅ Demo account already exists:", email);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email,
      password: hashed,
    },
  });

  // Seed some sample applications so the demo looks interesting
  const apps = [
    { companyName: "Tokopedia", position: "Software Engineer", status: "INTERVIEW", appliedDate: new Date("2026-09-01"), notes: "Good culture fit, strong Next.js team" },
    { companyName: "Gojek", position: "Backend Engineer", status: "SCREENING", appliedDate: new Date("2026-09-05"), notes: "Python + microservices stack" },
    { companyName: "Traveloka", position: "Full Stack Developer", status: "APPLIED", appliedDate: new Date("2026-09-10") },
    { companyName: "Shopee", position: "Frontend Developer", status: "REJECTED", appliedDate: new Date("2026-08-20"), notes: "Required 2 years experience" },
    { companyName: "Bukalapak", position: "Software Engineer", status: "OFFER", appliedDate: new Date("2026-08-15"), notes: "Offer received! Evaluating salary." },
    { companyName: "Ruangguru", position: "Web Developer", status: "APPLIED", appliedDate: new Date("2026-09-12") },
  ] as const;

  for (const app of apps) {
    await prisma.application.create({
      data: {
        userId: user.id,
        companyName: app.companyName,
        position: app.position,
        status: app.status,
        appliedDate: app.appliedDate,
        notes: "notes" in app ? app.notes : undefined,
        statusHistory: {
          create: [
            { status: "APPLIED", changedAt: app.appliedDate },
            ...(app.status !== "APPLIED" ? [{ status: app.status, changedAt: new Date() }] : []),
          ],
        },
      },
    });
  }

  console.log("✅ Demo account created successfully!");
  console.log("   Email:    demo@jobtrail.app");
  console.log("   Password: Demo1234");
  console.log(`   ${apps.length} sample applications seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
