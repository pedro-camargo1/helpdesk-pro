"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Reports Page
// Detailed analytics and performance insights
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, Clock, Star, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Mock data ─────────────────────────────────

const MONTHLY_TREND = [
  { month: "Jan", abertos: 58, resolvidos: 52, fechados: 8 },
  { month: "Fev", abertos: 72, resolvidos: 68, fechados: 12 },
  { month: "Mar", abertos: 65, resolvidos: 70, fechados: 10 },
  { month: "Abr", abertos: 89, resolvidos: 82, fechados: 15 },
  { month: "Mai", abertos: 78, resolvidos: 85, fechados: 18 },
  { month: "Jun", abertos: 95, resolvidos: 90, fechados: 20 },
  { month: "Jul", abertos: 83, resolvidos: 88, fechados: 16 },
];

const CATEGORY_VOLUME = [
  { name: "Infraestrutura", count: 48, color: "#6366f1" },
  { name: "Autenticação", count: 35, color: "#f59e0b" },
  { name: "Relatórios", count: 29, color: "#22c55e" },
  { name: "Performance", count: 24, color: "#8b5cf6" },
  { name: "Acessos", count: 19, color: "#14b8a6" },
  { name: "Banco de Dados", count: 15, color: "#ef4444" },
  { name: "Interface", count: 12, color: "#ec4899" },
  { name: "Outros", count: 8, color: "#64748b" },
];

const AGENT_RADAR = [
  { subject: "Volume", Ana: 90, Rafael: 75, Fernanda: 60 },
  { subject: "Velocidade", Ana: 80, Rafael: 85, Fernanda: 70 },
  { subject: "Satisfação", Ana: 95, Rafael: 78, Fernanda: 85 },
  { subject: "SLA", Ana: 88, Rafael: 82, Fernanda: 76 },
  { subject: "Qualidade", Ana: 92, Rafael: 80, Fernanda: 88 },
];

const RESOLUTION_TIME = [
  { day: "Seg", horas: 6.2 },
  { day: "Ter", horas: 8.4 },
  { day: "Qua", horas: 5.8 },
  { day: "Qui", horas: 9.1 },
  { day: "Sex", horas: 7.3 },
  { day: "Sáb", horas: 4.2 },
  { day: "Dom", horas: 3.1 },
];

const AGENTS_PERFORMANCE = [
  { name: "Ana Oliveira",   resolved: 94,  avg_hours: 6.2,  satisfaction: 4.8, sla: 92 },
  { name: "Rafael Costa",   resolved: 67,  avg_hours: 8.4,  satisfaction: 4.5, sla: 85 },
  { name: "Fernanda Lima",  resolved: 31,  avg_hours: 7.1,  satisfaction: 4.6, sla: 88 },
];

// ── Metric card ───────────────────────────────

function MetricCard({ title, value, sub, icon: Icon, color, delay = 0 }: {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
        </div>
        <div className={cn("rounded-lg p-2.5", color)}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Section header ─────────────────────────────

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── Period selector ───────────────────────────

function PeriodSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = ["7d", "30d", "90d", "12m"];
  const labels: Record<string, string> = { "7d": "7 dias", "30d": "30 dias", "90d": "90 dias", "12m": "12 meses" };

  return (
    <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            value === opt
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

// ── Tooltip custom ────────────────────────────

const ChartTooltip = {
  contentStyle: {
    background: "hsl(var(--background))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
  },
};

// ── Main page ─────────────────────────────────

export default function ReportsPage() {
  const [period, setPeriod] = useState("30d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Relatórios</h1>
          <p className="text-sm text-muted-foreground">
            Análise detalhada de desempenho e tendências
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricCard title="Total Resolvidos" value="192" sub="no período selecionado" icon={Target} color="bg-brand-500" delay={0} />
        <MetricCard title="Tempo Médio" value="7.4h" sub="para resolução completa" icon={Clock} color="bg-amber-500" delay={0.05} />
        <MetricCard title="Satisfação" value="4.6/5" sub="média dos chamados" icon={Star} color="bg-emerald-500" delay={0.1} />
        <MetricCard title="SLA" value="88%" sub="conformidade no período" icon={TrendingUp} color="bg-sky-500" delay={0.15} />
      </div>

      {/* Monthly trend */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
      >
        <SectionTitle
          title="Tendência Mensal"
          sub="Chamados abertos, resolvidos e fechados por mês"
        />
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={MONTHLY_TREND}>
            <defs>
              <linearGradient id="gAbertos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gResolvidos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip {...ChartTooltip} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" dataKey="abertos" name="Abertos" stroke="#6366f1" strokeWidth={2} fill="url(#gAbertos)" />
            <Area type="monotone" dataKey="resolvidos" name="Resolvidos" stroke="#22c55e" strokeWidth={2} fill="url(#gResolvidos)" />
            <Line type="monotone" dataKey="fechados" name="Fechados" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Two charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Volume by category */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
        >
          <SectionTitle title="Volume por Categoria" sub="Quantidade de chamados abertos" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CATEGORY_VOLUME} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...ChartTooltip} />
              <Bar dataKey="count" name="Chamados" radius={[0, 4, 4, 0]}>
                {CATEGORY_VOLUME.map((entry, index) => (
                  <rect key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Resolution time by day */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
        >
          <SectionTitle title="Tempo de Resolução" sub="Média de horas por dia da semana" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={RESOLUTION_TIME}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30} unit="h" />
              <Tooltip {...ChartTooltip} formatter={(v) => [`${v}h`, "Tempo médio"]} />
              <Bar dataKey="horas" name="Horas" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Agent performance radar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
      >
        <SectionTitle title="Desempenho por Agente" sub="Comparação multidimensional da equipe de suporte" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Radar */}
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={AGENT_RADAR}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Ana" dataKey="Ana" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Rafael" dataKey="Rafael" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Fernanda" dataKey="Fernanda" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Agente</th>
                  <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Resolvidos</th>
                  <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Avg. horas</th>
                  <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Satisfação</th>
                  <th className="pb-2 text-center text-xs font-medium text-muted-foreground">SLA</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS_PERFORMANCE.map((agent, i) => (
                  <tr key={agent.name} className="border-b border-border/50">
                    <td className="py-3 text-sm font-medium">{agent.name.split(" ")[0]}</td>
                    <td className="py-3 text-center text-sm">{agent.resolved}</td>
                    <td className="py-3 text-center text-sm">{agent.avg_hours}h</td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        agent.satisfaction >= 4.7 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        ⭐ {agent.satisfaction}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        agent.sla >= 90 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {agent.sla}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
