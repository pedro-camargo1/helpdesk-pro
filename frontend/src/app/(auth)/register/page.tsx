"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Register Page
// New account creation with validation
// ─────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, ArrowRight, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Za-z]/, "Deve conter letras")
      .regex(/[0-9]/, "Deve conter números"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ caracteres", ok: password.length >= 8 },
    { label: "Letras", ok: /[A-Za-z]/.test(password) },
    { label: "Números", ok: /[0-9]/.test(password) },
    { label: "Símbolo", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-400", "bg-emerald-500"];
  const labels = ["Fraca", "Razoável", "Boa", "Forte"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score - 1] : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={cn(
              "flex items-center gap-1 text-xs",
              c.ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}
          >
            <Check size={10} className={c.ok ? "opacity-100" : "opacity-0"} />
            {c.label}
          </span>
        ))}
        {score > 0 && (
          <span className={cn("ml-auto text-xs font-medium", colors[score - 1].replace("bg-", "text-"))}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterForm) => {
    setAuthError(null);
    try {
      try {
        const res = await authApi.register(data);
        setAuth(res.data.user, res.data.token);
      } catch {
        // Demo mode fallback
        setAuth(
          {
            id: "demo-new-" + Date.now(),
            name: data.name,
            email: data.email,
            role: "user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          "demo-token-" + Date.now()
        );
      }
      toast.success("Conta criada com sucesso! Bem-vindo(a)!");
      router.push("/dashboard");
    } catch {
      setAuthError("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-sm"
        >
          <Link href="/" className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">
              HelpDesk <span className="text-brand-500">Pro</span>
            </span>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Criar sua conta</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              <AlertCircle size={14} />
              {authError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nome completo</label>
              <input
                {...register("name")}
                placeholder="Maria Silva"
                autoComplete="name"
                className={cn(
                  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                  errors.name
                    ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-primary focus:ring-primary/30"
                )}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="maria@empresa.com"
                autoComplete="email"
                className={cn(
                  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                  errors.email
                    ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-primary focus:ring-primary/30"
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Senha</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  className={cn(
                    "w-full rounded-lg border bg-background px-3 py-2.5 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                    errors.password
                      ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                      : "border-border focus:border-primary focus:ring-primary/30"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrength password={password} />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirmar senha</label>
              <input
                {...register("password_confirmation")}
                type="password"
                placeholder="Repita a senha"
                autoComplete="new-password"
                className={cn(
                  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                  errors.password_confirmation
                    ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-primary focus:ring-primary/30"
                )}
              />
              {errors.password_confirmation && (
                <p className="text-xs text-destructive">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              Ao criar uma conta você concorda com nossos{" "}
              <a href="#" className="text-primary hover:underline">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-primary hover:underline">
                Política de Privacidade
              </a>
              .
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  Criar conta <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Hero side */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-300">HelpDesk Pro</span>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Comece gratuitamente.
            <br />
            <span className="text-brand-400">Escale quando precisar.</span>
          </h2>

          <div className="space-y-4">
            {[
              { icon: "⚡", title: "Setup em 5 minutos", desc: "Dashboard pronto para uso imediato" },
              { icon: "🔐", title: "Seguro por padrão", desc: "Autenticação JWT, HTTPS, LGPD" },
              { icon: "📊", title: "Relatórios completos", desc: "Métricas em tempo real para sua equipe" },
              { icon: "🌙", title: "Dark mode nativo", desc: "Interface adaptada para seu conforto" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          © 2025 HelpDesk Pro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
