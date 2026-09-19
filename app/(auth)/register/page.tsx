"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    const result = await registerUser(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    // Auto-login after register
    const loginResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (loginResult?.error) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">JobTrail</span>
          </div>
          <h1 className="text-xl font-semibold text-text">Mulai tracking lamaran</h1>
          <p className="text-sm text-text-muted mt-1">Buat akun gratis, tidak perlu kartu kredit</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#f87171] text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Nama kamu"
              error={errors.name?.message}
              required
              {...register("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="kamu@email.com"
              error={errors.email?.message}
              required
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 karakter + huruf kapital + angka"
              error={errors.password?.message}
              hint="Minimal 8 karakter, mengandung huruf kapital dan angka"
              required
              {...register("password")}
            />
            <Input
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              error={errors.confirmPassword?.message}
              required
              {...register("confirmPassword")}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Buat Akun
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary hover:text-[#a78bfa] font-medium transition-colors">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
