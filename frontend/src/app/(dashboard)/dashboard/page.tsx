"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Dashboard Page
// KPI cards, charts, recent tickets
// ─────────────────────────────────────────────

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { dashboardApi } from "@/lib/api";
import {
  cn,
  formatRelativeDate,
  formatHours,
  formatNumber,
} from "@/lib/utils";
import type { DashboardStats, DashboardCharts } from "@/types";

// ── Mock data (used until backend is connected) ─

const MOCK_STATS: DashboardStats = {
  total_tickets: 248,
  open_tickets: 47,
  in_progress_tickets: 31,
  resolved_tickets: 152,
  closed_tickets: 18,
  avg_resolution_hours: 8.4,
  tickets_this_week: 34,
  tickets_change_percent: 12.5,
};

const MOCK_CHART_DATA = [
  { date: "Seg", opened: 8, resolved: 5, closed: 2 },
  { date: "Ter", opened: 12, resolved: 9, closed: 3 },
  { date: "Qua", opened: 7, resolved: 11, closed: 4 },
  { date: "Qui", opened: 15, resolved: 8, closed: 2 },
  { date: "Sex", opened: 10, resolved: 13, closed: 5 },
  { date: "Sáb", opened: 4, resolved: 6, closed: 3 },
  { date: "Dom", opened: 3, resolved: 4, closed: 1 },
];

const MOCK_PRIORITY_DATA = [
  { name: "Crítica", value: 12, color: "#ef4444" },
  { name: "Alta", value: 28, color: "#f97316" },
  { name: "Média", value: 95, color: "#f59e0b" },
  { name: "Baixa", value: 113, color: "#22c55e" },
];

const MOCK_RECENT_TICKETS = [
  {
    id: "TK-1042",
    title: "Falha crítica no servidor de produção",
    status: "in_progress",
    priority: "critical",
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    reporter: { name: "Carlos Silva" },
  },
  {
    id: "TK-1041",
    title: "Usuário não consegue acessar o painel",
    status: "open",
    priority: "high",
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    reporter: { name: "Ana Oliveira" },
  },
  {
    id: "TK-1040",
    title: "Erro ao exportar relatório em PDF",
    status: "open",
    priority: "medium",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    reporter: { name: "Pedro Santos" },
  },
  {
    id: "TK-1039",
    title: "Solicitar acesso ao módulo financeiro",
    status: "resolved",
    priority: "low",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    reporter: { name: "Lucia Mendes" },
  },
];

// ── KPI Card ───────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  icon: React.ElementType;
  color: string;
  delay?: number;
}

function KpiCard({ title, value, change, icon: Icon, color, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl border border-border bg-background p-5 shadow-card-sm card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          {change && (
            <div
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                change.positive ? "text-emerald-600" : "text-red-500"
              )}
            >
              {change.positive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>
                {change.positive ? "+" : "-"}
                {Math.abs(change.value)}% vs semana anterior
              </span>
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", color)}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Status badge ──────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "badge-open",
    in_progress: "badge-in_progress",
    resolved: "badge-resolved",
    closed: "badge-closed",
  };
  const labels: Record<string, string> = {
    open: "Aberto",
    in_progress: "Em Andamento",
    resolved: "Resolvido",
    closed: "Fechado",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        map[status] || "bg-muted text-muted-foreground"
      )}
    >
      {labels[status] || status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-amber-400",
    low: "bg-emerald-500",
  };
  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full", colors[priority])}
    />
  );
}

// ── Skeleton ──────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton mt-2 h-7 w-16 rounded" />
          <div className="skeleton mt-2 h-3 w-36 rounded" />
        </div>
        <div className="skeleton h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────

export default function DashboardPage() {
  // In production, fetch from API; for now use mock data
  const stats = MOCK_STATS;
  const isLoading = false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do sistema de chamados
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
        >
          <Ticket size={14} />
          Novo Chamado
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <KpiCard
              title="Total de Chamados"
              value={formatNumber(stats.total_tickets)}
              change={{ value: stats.tickets_change_percent, positive: true }}
              icon={Ticket}
              color="bg-brand-500"
              delay={0}
            />
            <KpiCard
              title="Chamados Abertos"
              value={stats.open_tickets}
              icon={AlertCircle}
              color="bg-sky-500"
              delay={0.05}
            />
            <KpiCard
              title="Em Andamento"
              value={stats.in_progress_tickets}
              icon={Clock}
              color="bg-amber-500"
              delay={0.1}
            />
            <KpiCard
              title="Resolvidos"
              value={stats.resolved_tickets}
              icon={CheckCircle2}
              color="bg-emerald-500"
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Area chart — trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1 rounded-xl border border-border bg-background p-5 shadow-card-sm xl:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Tendência Semanal</h2>
              <p className="text-xs text-muted-foreground">
                Chamados abertos vs resolvidos nos últimos 7 dias
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="opened"
                name="Abertos"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorOpened)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name="Resolvidos"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#colorResolved)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart — priority */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
        >
          <div className="mb-4">
            <h2 className="text-base font-semibold">Por Prioridade</h2>
            <p className="text-xs text-muted-foreground">
              Distribuição atual dos chamados
            </p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={MOCK_PRIORITY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {MOCK_PRIORITY_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary numbers */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            {MOCK_PRIORITY_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name}
                </span>
                <span className="ml-auto text-xs font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Recent tickets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-xl border border-border bg-background shadow-card-sm"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">Chamados Recentes</h2>
            <Link
              href="/tickets"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {MOCK_RECENT_TICKETS.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
              >
                <PriorityDot priority={ticket.priority} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {ticket.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {ticket.id} · por {ticket.reporter.name} ·{" "}
                    {formatRelativeDate(ticket.created_at)}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
        >
          <h2 className="mb-4 text-base font-semibold">Métricas de Desempenho</h2>

          <div className="space-y-4">
            {/* Avg resolution time */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tempo médio de resolução</span>
                <span className="font-medium">{formatHours(stats.avg_resolution_hours)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: "62%" }}
                />
              </div>
            </div>

            {/* SLA compliance */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Conformidade com SLA</span>
                <span className="font-medium text-emerald-600">87%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: "87%" }}
                />
              </div>
            </div>

            {/* Customer satisfaction */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Satisfação do cliente</span>
                <span className="font-medium text-amber-600">4.2/5</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: "84%" }}
                />
              </div>
            </div>

            {/* First response time */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tempo 1ª resposta</span>
                <span className="font-medium">{formatHours(1.3)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
          </div>

          {/* Tickets this week */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-500/10 p-2.5">
                <Users size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.tickets_this_week}</p>
                <p className="text-xs text-muted-foreground">
                  chamados criados esta semana
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp size={12} />
                +{stats.tickets_change_percent}%
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
