"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function registerUser(
  formData: unknown
): Promise<ActionResult<{ id: string; email: string }>> {
  try {
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "Data tidak valid",
      };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email sudah digunakan" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, email: true },
    });

    return { success: true, data: user };
  } catch {
    return { success: false, error: "Terjadi kesalahan. Coba lagi nanti." };
  }
}
