"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useCurrentUser, useLogin } from "@/hooks/useAuth";
import { Link, useRouter } from "@/i18n/navigation";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { mutate, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (currentUser) {
      router.replace("/admin/dashboard");
    }
  }, [currentUser, router]);

  const onSubmit = (values: LoginValues) => {
    mutate(values, {
      onSuccess: () => router.replace("/admin/dashboard"),
    });
  };

  return (
    <main className="grid min-h-dvh w-full bg-[#F6F3EC] lg:grid-cols-[minmax(0,1.05fr)_minmax(500px,.95fr)]">
      <section className="relative hidden min-h-dvh overflow-hidden bg-[linear-gradient(145deg,#173F61_0%,#0F2942_48%,#091C2E_100%)] lg:block">
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -left-8 top-[42%] h-52 w-52 rounded-full border border-brand-gold/20" aria-hidden="true" />
        <div className="absolute bottom-[-12rem] right-[-9rem] h-[34rem] w-[34rem] rounded-full bg-brand-green/20 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 flex h-full min-h-dvh flex-col justify-between p-10 xl:p-14">
          <Link href="/" aria-label="Return to the ShareHope website" className="w-fit rounded-xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
            <Image src="/logo-sharehope-blue.png" alt="ShareHope" width={202} height={64} className="h-12 w-auto" priority />
          </Link>

          <div className="max-w-xl pb-4 text-white">
            <p className="font-mono-spaced text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">ShareHope administration</p>
            <h1 className="font-serif mt-5 text-5xl font-semibold leading-[1.02] tracking-tight xl:text-6xl">Manage stories. Strengthen impact.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/78">A secure workspace for managing ShareHope’s programs, events, community stories, and website content.</p>
          </div>

          <p className="text-xs text-white/55">Authorized ShareHope team members only</p>
        </div>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <Link href="/" aria-label="Return to the ShareHope website" className="mb-10 inline-flex rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-[#DADFD9] lg:hidden">
            <Image src="/logo-sharehope-blue.png" alt="ShareHope" width={174} height={55} className="h-10 w-auto" priority />
          </Link>

          <div className="mb-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5EFE8] text-brand-green">
              <LockKeyhole size={22} aria-hidden="true" />
            </div>
            <p className="font-mono-spaced text-[11px] font-bold uppercase tracking-[0.2em] text-brand-green">Admin portal</p>
            <h2 className="font-serif mt-3 text-4xl font-semibold tracking-tight text-brand-navy">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Sign in with your authorized ShareHope account to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-navy" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="name@sharehope.org"
                className="h-12 w-full rounded-xl border border-[#CCD5D0] bg-white px-4 text-[15px] text-brand-navy shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                {...register("email")}
              />
              {errors.email && <p id="email-error" className="mt-2 text-sm font-medium text-red-700">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-navy" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-[#CCD5D0] bg-white px-4 pr-12 text-[15px] text-brand-navy shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-green"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="mt-2 text-sm font-medium text-red-700">{errors.password.message}</p>}
            </div>

            {error && (
              <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                We couldn’t sign you in. Check your email and password and try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,41,66,.18)] transition hover:bg-[#173A59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:cursor-wait disabled:opacity-65"
            >
              <span>{isPending ? "Signing in…" : t("login")}</span>
              {!isPending && <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
            </button>
          </form>

          <div className="mt-8 flex items-start gap-3 border-t border-[#D9DED9] pt-6 text-xs leading-5 text-slate-500">
            <ShieldCheck className="mt-0.5 shrink-0 text-brand-green" size={17} aria-hidden="true" />
            <p>Your session is protected and access is limited according to your assigned administrative role.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
