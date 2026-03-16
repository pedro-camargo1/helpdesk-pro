"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Landing Page
// Hero, features, testimonials, CTA
// ─────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  BarChart3,
  Shield,
  Bell,
  Users,
  Ticket,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Lock,
  MessageSquare,
  Filter,
} from "lucide-react";

// ── Hero section ──────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-24 pb-20">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            Plataforma SaaS de Gestão de Chamados
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mx-auto max-w-4xl text-center text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl"
        >
          Suporte técnico{" "}
          <span className="gradient-text">mais rápido,</span>
          <br />
          mais inteligente.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-center text-lg text-slate-400"
        >
          HelpDesk Pro centraliza todos os chamados da sua equipe em uma interface
          moderna, com dashboard em tempo real, automações e relatórios completos.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-600 hover:shadow-none active:scale-95"
          >
            Começar gratuitamente
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white"
          >
            Ver demonstração
            <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500"
        >
          {["Sem cartão de crédito", "Setup em 5 minutos", "Suporte 24/7", "LGPD compliance"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-brand-500" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-14 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl"
        >
          {/* Mock browser bar */}
          <div className="flex items-center gap-2 border-b border-slate-700/50 bg-slate-800/50 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-amber-400/60" />
              <div className="h-3 w-3 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 rounded-md bg-slate-700/50 px-3 py-1 text-xs text-slate-400">
              app.helpdesk.pro/dashboard
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="p-6">
            <div className="mb-4 grid grid-cols-4 gap-3">
              {[
                { label: "Total Chamados", value: "248", color: "bg-brand-500" },
                { label: "Abertos", value: "47", color: "bg-sky-500" },
                { label: "Em Andamento", value: "31", color: "bg-amber-500" },
                { label: "Resolvidos", value: "152", color: "bg-emerald-500" },
              ].map((card) => (
                <div key={card.label} className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
                  <p className="text-xs text-slate-400">{card.label}</p>
                  <p className={`mt-1 text-xl font-bold text-white`}>{card.value}</p>
                  <div className={`mt-2 h-1 w-full rounded-full ${card.color} opacity-40`} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
                <p className="mb-2 text-xs font-medium text-slate-300">Tendência Semanal</p>
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 48, 80, 60, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-brand-500/40" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
                <p className="mb-2 text-xs font-medium text-slate-300">Por Prioridade</p>
                <div className="space-y-1.5">
                  {[
                    { label: "Crítica", w: "15%", color: "bg-red-500" },
                    { label: "Alta", w: "30%", color: "bg-orange-500" },
                    { label: "Média", w: "75%", color: "bg-amber-400" },
                    { label: "Baixa", w: "90%", color: "bg-green-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="w-12 text-xs text-slate-400">{item.label}</span>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-700">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Features section ──────────────────────────

const FEATURES = [
  {
    icon: Ticket,
    title: "CRUD Completo de Chamados",
    description: "Crie, edite, atribua e resolva chamados com formulários intuitivos e validações em tempo real.",
    color: "bg-brand-500/10 text-brand-500",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analítico",
    description: "Métricas em tempo real, gráficos de tendência, distribuição por prioridade e KPIs de desempenho.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Filter,
    title: "Filtros e Busca Avançados",
    description: "Filtre por status, prioridade, categoria, responsável e data. Busca full-text instantânea.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: MessageSquare,
    title: "Histórico e Comentários",
    description: "Histórico completo de alterações, comentários internos e comunicação com o solicitante.",
    color: "bg-sky-500/10 text-sky-500",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description: "Controle de papéis (admin, agente, usuário), atribuições automáticas e métricas por agente.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Bell,
    title: "Notificações em Tempo Real",
    description: "Alertas por email e no sistema para novos chamados, atualizações e prazos próximos.",
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: Shield,
    title: "Autenticação Segura",
    description: "Login com JWT, proteção de rotas, controle de sessão e refresh token automático.",
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    icon: TrendingUp,
    title: "SLA e Performance",
    description: "Monitore conformidade com SLA, tempo médio de resolução e satisfação do cliente.",
    color: "bg-orange-500/10 text-orange-500",
  },
];

function Features() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Tudo que sua equipe precisa
          </h2>
          <p className="mt-3 text-muted-foreground">
            Funcionalidades pensadas para aumentar a produtividade do suporte técnico.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border border-border bg-background p-5 card-hover"
              >
                <div className={`mb-3 inline-flex rounded-lg p-2.5 ${feature.color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────

const TESTIMONIALS = [
  {
    name: "Carlos Mendes",
    role: "Gerente de TI",
    company: "LogisTech Brasil",
    avatar: "CM",
    color: "bg-blue-500",
    quote: "Em 30 dias, reduzimos o tempo médio de resolução de 24h para 6h. A visibilidade do dashboard mudou tudo para a nossa gestão.",
    rating: 5,
  },
  {
    name: "Patricia Andrade",
    role: "Head of Support",
    company: "FinançasCorp",
    avatar: "PA",
    color: "bg-rose-500",
    quote: "A interface é muito mais intuitiva que os concorrentes. Nossa equipe adotou sem nenhum treinamento especial. Excelente produto.",
    rating: 5,
  },
  {
    name: "Ricardo Nunes",
    role: "CTO",
    company: "AgriSmart",
    avatar: "RN",
    color: "bg-emerald-600",
    quote: "Os filtros avançados e o histórico de chamados nos deram controle total sobre o suporte. Vale muito o investimento.",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">O que dizem nossos clientes</h2>
          <p className="mt-3 text-muted-foreground">
            Empresas que transformaram seu suporte com o HelpDesk Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-background p-6 shadow-card-sm"
            >
              <div className="mb-4 flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.color} text-xs font-semibold text-white`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA section ───────────────────────────────

function Cta() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white">
            Pronto para transformar
            <br />
            seu suporte técnico?
          </h2>
          <p className="mt-4 text-slate-400">
            Comece hoje, sem cartão de crédito. Sua equipe estará operacional em menos de 5 minutos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-95"
            >
              Criar conta gratuitamente
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-8 py-3.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white"
            >
              Acessar demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Navbar ────────────────────────────────────

function LandingNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-white">
            HelpDesk <span className="text-brand-400">Pro</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          <a href="#features" className="hover:text-white">Recursos</a>
          <a href="#pricing" className="hover:text-white">Preços</a>
          <a href="#testimonials" className="hover:text-white">Clientes</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Footer ────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-400">HelpDesk Pro</span>
        </div>
        <p className="text-xs text-slate-600">
          © 2025 HelpDesk Pro · Projeto de portfólio · MIT License
        </p>
        <div className="flex gap-4 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-300">Privacidade</a>
          <a href="#" className="hover:text-slate-300">Termos</a>
          <a href="#" className="hover:text-slate-300">Contato</a>
        </div>
      </div>
    </footer>
  );
}

// ── Page export ───────────────────────────────

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
