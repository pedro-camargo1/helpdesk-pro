"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Login Page
// Modern auth form with validation
// ─────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

// Demo credentials
const DEMO_CREDENTIALS = [
  { label: "Admin", email: "admin@helpdesk.pro", password: "password" },
  { label: "Agente", email: "agent@helpdesk.pro", password: "password" },
  { label: "Usuário", email: "user@helpdesk.pro", password: "password" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setAuthError(null);
    try {
      // Try real API, fallback to demo mode
      try {
        const response = await authApi.login(data.email, data.password);
        setAuth(response.data.user, response.data.token);
      } catch {
        // Demo mode: simulate auth if API is not running
        const demo = DEMO_CREDENTIALS.find(
          (c) => c.email === data.email && c.password === data.password
        );
        if (!demo) {
          setAuthError("Email ou senha incorretos. Use as credenciais de demo abaixo.");
          return;
        }
        // Simulate auth with mock user
        setAuth(
          {
            id: "demo-1",
            name: demo.label === "Admin" ? "Admin Helpdesk" : demo.label === "Agente" ? "Ana Oliveira" : "Carlos Silva",
            email: demo.email,
            role: demo.label.toLowerCase() as "admin" | "agent" | "user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          "demo-token-" + Date.now()
        );
      }

      toast.success("Bem-vindo de volta!");
      router.push("/dashboard");
    } catch (error) {
      setAuthError("Erro ao fazer login. Tente novamente.");
    }
  };

  const fillDemo = (cred: (typeof DEMO_CREDENTIALS)[0]) => {
    setValue("email", cred.email);
    setValue("password", cred.password);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side — Form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">
              HelpDesk <span className="text-brand-500">Pro</span>
            </span>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Entrar na plataforma</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </div>

          {/* Demo shortcuts */}
          <div className="mb-5 rounded-lg border border-border bg-muted/40 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              ⚡ Acesso rápido (demo):
            </p>
            <div className="flex gap-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.label}
                  type="button"
                  onClick={() => fillDemo(cred)}
                  className="flex-1 rounded-md bg-background px-2 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="seu@email.com"
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register("remember")}
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-border text-primary accent-primary"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Manter conectado por 30 dias
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  Entrar <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Right side — Hero */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between bg-slate-900 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-300">HelpDesk Pro</span>
        </div>

        <div>
          <blockquote className="text-xl font-medium leading-relaxed text-white">
            "O HelpDesk Pro transformou como gerenciamos o suporte. Nosso tempo de resolução caiu 60% no primeiro mês."
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold">
              MS
            </div>
            <div>
              <p className="text-sm font-medium">Marina Souza</p>
              <p className="text-xs text-slate-400">CTO, TechFlow Soluções</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: "Chamados resolvidos", value: "48k+" },
              { label: "Empresas ativas", value: "1.200+" },
              { label: "Satisfação média", value: "4.8/5" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-brand-400">{stat.value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
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
