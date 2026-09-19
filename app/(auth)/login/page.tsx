"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const DEMO_EMAIL = "demo@jobtrail.app";
const DEMO_PASSWORD = "Demo1234";


function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Email atau password salah. Coba lagi.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  async function handleDemoLogin() {
    setIsDemoLoading(true);
    setServerError(null);
    setValue("email", DEMO_EMAIL);
    setValue("password", DEMO_PASSWORD);
    const result = await signIn("credentials", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      redirect: false,
    });
    if (result?.error) {
      setServerError("Demo account not available. Please register a free account.");
      setIsDemoLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {/* Demo banner */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={isDemoLoading || isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 text-[#6ee7b7] text-sm font-semibold hover:bg-[#10b981]/20 hover:border-[#10b981]/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isDemoLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        ) : (
          <span>⚡</span>
        )}
        {isDemoLoading ? "Logging in..." : "Try Demo — No sign-up needed"}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10"/>
        <span className="text-xs text-text-muted">or sign in</span>
        <div className="flex-1 h-px bg-white/10"/>
      </div>

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
          placeholder="••••••••"
          error={errors.password?.message}
          required
          {...register("password")}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
        >
          Masuk
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6366f1]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">JobTrail</span>
          </div>
          <h1 className="text-xl font-semibold text-text">Selamat datang kembali</h1>
          <p className="text-sm text-text-muted mt-1">Masuk untuk melanjutkan tracking lamaran</p>
        </div>

        {/* Wrap useSearchParams in Suspense as required by Next.js 15 */}
        <Suspense fallback={
          <div className="glass rounded-2xl p-6 h-48 animate-pulse" />
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-text-muted mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary hover:text-[#a78bfa] font-medium transition-colors">
            Daftar sekarang
          </Link>
        </p>

        {/* Portfolio attribution */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-text-muted/60">
            Part of the{" "}
            <a
              href="https://gryven.vercel.app"
              target="_blank"
              rel="noopener"
              className="text-primary/80 hover:text-[#a78bfa] transition-colors"
            >
              Job Hunting Suite
            </a>
            {" "}by Gryven Alverdo Gunawan
          </p>
        </div>
      </div>
    </div>
  );
}
