import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { DemoClient } from "./DemoClient";

export default async function DemoLogin() {
  const email = "demo@jobtrail.app";
  const password = "demo";
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name: "Demo User",
        password: hashedPassword,
      }
    });
  } else if (user.password) {
    // Optionally check if password is correct, but let's assume it is "demo"
  }

  // Render client component that automatically calls signIn
  return <DemoClient />;
}
