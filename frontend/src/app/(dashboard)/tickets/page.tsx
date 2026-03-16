"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Tickets List Page
// Filter, search, paginate, and manage tickets
// ─────────────────────────────────────────────

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MessageSquare,
  Clock,
  Trash2,
  Edit3,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { cn, formatRelativeDate, truncate } from "@/lib/utils";
import { debounce, getInitials, getAvatarColor } from "@/lib/utils";
import type { Ticket, TicketStatus, TicketPriority } from "@/types";

// ── Mock Data ─────────────────────────────────

const MOCK_TICKETS: Ticket[] = [
  {
    id: "TK-1042",
    title: "Falha crítica no servidor de produção — aplicação fora do ar",
    description: "O servidor principal está retornando erro 503 para todos os usuários.",
    status: "in_progress",
    priority: "critical",
    category: { id: 1, name: "Infraestrutura", color: "#6366f1", icon: "server" },
    reporter: { id: "u1", name: "Carlos Silva", email: "carlos@co.com", role: "user", created_at: "", updated_at: "" },
    assignee: { id: "u2", name: "Ana Oliveira", email: "ana@co.com", role: "agent", created_at: "", updated_at: "" },
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "TK-1041",
    title: "Usuário não consegue fazer login após atualização do sistema",
    description: "Desde a atualização de ontem, minha conta retorna erro de autenticação.",
    status: "open",
    priority: "high",
    category: { id: 2, name: "Autenticação", color: "#f59e0b", icon: "lock" },
    reporter: { id: "u3", name: "Pedro Santos", email: "pedro@co.com", role: "user", created_at: "", updated_at: "" },
    comments_count: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "TK-1040",
    title: "Erro ao exportar relatório financeiro em formato PDF",
    description: "O botão de exportar PDF no módulo financeiro não funciona.",
    status: "open",
    priority: "medium",
    category: { id: 3, name: "Relatórios", color: "#22c55e", icon: "file" },
    reporter: { id: "u4", name: "Lucia Mendes", email: "lucia@co.com", role: "user", created_at: "", updated_at: "" },
    assignee: { id: "u5", name: "Rafael Costa", email: "rafael@co.com", role: "agent", created_at: "", updated_at: "" },
    comments_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "TK-1039",
    title: "Solicitar acesso ao módulo de RH para novo colaborador",
    description: "Preciso liberar acesso para o novo funcionário João Paulo.",
    status: "resolved",
    priority: "low",
    category: { id: 4, name: "Acessos", color: "#14b8a6", icon: "key" },
    reporter: { id: "u6", name: "Mariana Ramos", email: "mariana@co.com", role: "user", created_at: "", updated_at: "" },
    assignee: { id: "u2", name: "Ana Oliveira", email: "ana@co.com", role: "agent", created_at: "", updated_at: "" },
    comments_count: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "TK-1038",
    title: "Lentidão no carregamento do módulo de estoque",
    description: "As consultas de estoque estão demorando mais de 30 segundos.",
    status: "in_progress",
    priority: "medium",
    category: { id: 5, name: "Performance", color: "#8b5cf6", icon: "zap" },
    reporter: { id: "u7", name: "Gustavo Lima", email: "gustavo@co.com", role: "user", created_at: "", updated_at: "" },
    comments_count: 4,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "TK-1037",
    title: "Integração com API do Correios retornando timeout",
    description: "Não conseguimos calcular frete no checkout.",
    status: "closed",
    priority: "high",
    category: { id: 1, name: "Infraestrutura", color: "#6366f1", icon: "server" },
    reporter: { id: "u8", name: "Beatriz Ferreira", email: "bia@co.com", role: "user", created_at: "", updated_at: "" },
    assignee: { id: "u5", name: "Rafael Costa", email: "rafael@co.com", role: "agent", created_at: "", updated_at: "" },
    comments_count: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

// ── Badge components ──────────────────────────

const STATUS_CONFIG: Record<TicketStatus, { label: string; class: string }> = {
  open: { label: "Aberto", class: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  in_progress: { label: "Em Andamento", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  resolved: { label: "Resolvido", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  closed: { label: "Fechado", class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; dot: string; class: string }> = {
  critical: { label: "Crítica", dot: "bg-red-500", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  high: { label: "Alta", dot: "bg-orange-500", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  medium: { label: "Média", dot: "bg-amber-400", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  low: { label: "Baixa", dot: "bg-green-500", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

function StatusBadge({ status }: { status: TicketStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", config.class)}>
      {config.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", config.class)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

// ── Ticket row ────────────────────────────────

function TicketRow({ ticket }: { ticket: Ticket }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className="group border-b border-border bg-background transition-colors hover:bg-muted/30">
      {/* ID */}
      <td className="py-3.5 pl-5 pr-3">
        <span className="font-mono text-xs font-medium text-muted-foreground">
          {ticket.id}
        </span>
      </td>

      {/* Title */}
      <td className="py-3.5 pr-4">
        <Link
          href={`/tickets/${ticket.id}`}
          className="block text-sm font-medium text-foreground hover:text-primary"
        >
          {truncate(ticket.title, 60)}
        </Link>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: ticket.category.color }}
          />
          {ticket.category.name}
          {ticket.comments_count > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MessageSquare size={10} />
                {ticket.comments_count}
              </span>
            </>
          )}
        </div>
      </td>

      {/* Priority */}
      <td className="py-3.5 pr-4">
        <PriorityBadge priority={ticket.priority} />
      </td>

      {/* Status */}
      <td className="py-3.5 pr-4">
        <StatusBadge status={ticket.status} />
      </td>

      {/* Assignee */}
      <td className="py-3.5 pr-4">
        {ticket.assignee ? (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                getAvatarColor(ticket.assignee.name)
              )}
            >
              {getInitials(ticket.assignee.name)}
            </div>
            <span className="text-xs text-muted-foreground">
              {ticket.assignee.name.split(" ")[0]}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )}
      </td>

      {/* Date */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={10} />
          {formatRelativeDate(ticket.created_at)}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-5">
        <div className="relative flex items-center justify-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontal size={14} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-border bg-background py-1 shadow-card-md"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent"
                >
                  <Eye size={12} /> Ver detalhes
                </Link>
                <Link
                  href={`/tickets/${ticket.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent"
                >
                  <Edit3 size={12} /> Editar
                </Link>
                <hr className="my-1 border-border" />
                <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 size={12} /> Excluir
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </tr>
  );
}

// ── Empty state ───────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <tr>
      <td colSpan={7}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 rounded-full bg-muted p-4">
            <AlertTriangle size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground">
            {hasFilters ? "Nenhum chamado encontrado" : "Sem chamados ainda"}
          </h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {hasFilters
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Crie o primeiro chamado para começar."}
          </p>
          {!hasFilters && (
            <Link
              href="/tickets/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={12} />
              Novo Chamado
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────

const STATUSES = ["all", "open", "in_progress", "resolved", "closed"] as const;
const PRIORITIES = ["all", "critical", "high", "medium", "low"] as const;

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = MOCK_TICKETS.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const hasFilters = !!search || statusFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Chamados</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} chamado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
        >
          <Plus size={14} />
          Novo Chamado
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar por título ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          <option value="all">Todos os status</option>
          <option value="open">Aberto</option>
          <option value="in_progress">Em Andamento</option>
          <option value="resolved">Resolvido</option>
          <option value="closed">Fechado</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          <option value="all">Todas as prioridades</option>
          <option value="critical">Crítica</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setPriorityFilter("all"); }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-card-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="py-3 pl-5 pr-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">ID</th>
                <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Título</th>
                <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Prioridade</th>
                <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Responsável</th>
                <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Criado</th>
                <th className="py-3 pr-5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <EmptyState hasFilters={hasFilters} />
              ) : (
                filtered.map((ticket) => (
                  <TicketRow key={ticket.id} ticket={ticket} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Mostrando {filtered.length} de {MOCK_TICKETS.length} chamados
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 text-xs text-muted-foreground">
                Página {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
