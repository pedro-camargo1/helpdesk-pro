"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Ticket Detail Page
// Full view: description, history, comments
// ─────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  Clock,
  MessageSquare,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  History,
  Send,
  Lock,
} from "lucide-react";
import { cn, formatDate, formatRelativeDate, getInitials, getAvatarColor } from "@/lib/utils";
import toast from "react-hot-toast";

// ── Mock ticket detail ────────────────────────

const MOCK_TICKET = {
  id: "TK-1042",
  title: "Falha crítica no servidor de produção — aplicação fora do ar",
  description: `O servidor principal de produção está retornando erro 503 para todos os usuários desde as 14h30 de hoje.

**Impacto:**
- Todos os usuários do sistema estão impedidos de acessar a plataforma
- Estimativa de 200+ usuários afetados
- Processos de faturamento automático podem ter sido interrompidos

**Passos para reproduzir:**
1. Acessar https://app.empresa.com
2. Qualquer rota retorna "503 Service Unavailable"

**Informações técnicas:**
- Ambiente: Produção (AWS EC2 us-east-1)
- Stack: Node.js 20 + Nginx
- Última deploy: 13h45 (build #847)
- Logs do Nginx: \`upstream connect() failed (111: Connection refused)\`

**Ação imediata solicitada:** Rollback do deploy #847 ou investigação urgente.`,
  status: "in_progress",
  priority: "critical",
  category: { id: 1, name: "Infraestrutura", color: "#6366f1", icon: "server" },
  reporter: { id: "u3", name: "Carlos Silva", email: "carlos@co.com", role: "user" as const, department: "Engenharia", created_at: "", updated_at: "" },
  assignee: { id: "u2", name: "Ana Oliveira", email: "ana@co.com", role: "agent" as const, department: "Suporte TI", created_at: "", updated_at: "" },
  comments: [
    {
      id: "c1",
      user: { id: "u2", name: "Ana Oliveira", role: "agent" as const, email: "", created_at: "", updated_at: "" },
      body: "Recebi o chamado. Estou verificando os logs do servidor agora. O deploy #847 está sob investigação.",
      is_internal: false,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "c2",
      user: { id: "u2", name: "Ana Oliveira", role: "agent" as const, email: "", created_at: "", updated_at: "" },
      body: "[INTERNO] Confirmado — o processo Node.js travou após o deploy. Iniciando rollback para build #846.",
      is_internal: true,
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "c3",
      user: { id: "u3", name: "Carlos Silva", role: "user" as const, email: "", created_at: "", updated_at: "" },
      body: "Conseguimos confirmar que o problema afeta 100% dos usuários. Alguma previsão de resolução?",
      is_internal: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  history: [
    {
      id: 1,
      user: { id: "u3", name: "Carlos Silva", role: "user" as const, email: "", created_at: "", updated_at: "" },
      action: "created",
      description: "abriu este chamado",
      from_value: null,
      to_value: null,
      created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: 2,
      user: { id: "u1", name: "Admin HelpDesk", role: "admin" as const, email: "", created_at: "", updated_at: "" },
      action: "changed_assignee",
      description: "atribuiu o chamado para Ana Oliveira",
      from_value: null,
      to_value: "Ana Oliveira",
      created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
      id: 3,
      user: { id: "u2", name: "Ana Oliveira", role: "agent" as const, email: "", created_at: "", updated_at: "" },
      action: "changed_status",
      description: 'alterou o status de "open" para "in_progress"',
      from_value: "open",
      to_value: "in_progress",
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  ],
  comments_count: 3,
  created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
};

// ── Components ────────────────────────────────

const STATUS_CONFIG = {
  open:        { label: "Aberto",       class: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  in_progress: { label: "Em Andamento", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  resolved:    { label: "Resolvido",    class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  closed:      { label: "Fechado",      class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
};

const PRIORITY_CONFIG = {
  critical: { label: "Crítica", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" },
  high:     { label: "Alta",    class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", dot: "bg-orange-500" },
  medium:   { label: "Média",   class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-400" },
  low:      { label: "Baixa",   class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
};

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const s = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-xs";
  return (
    <div className={cn("flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white", s, getAvatarColor(name))}>
      {getInitials(name)}
    </div>
  );
}

// ── Comment form ──────────────────────────────

function CommentForm({ onSubmit }: { onSubmit: (body: string, internal: boolean) => void }) {
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(body, isInternal);
    setBody("");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Escreva uma resposta ou atualização..."
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
            className="accent-primary"
          />
          <Lock size={11} />
          Nota interna (visível apenas para agentes)
        </label>
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send size={12} />
          )}
          Enviar
        </button>
      </div>
    </form>
  );
}

// ── Main page ─────────────────────────────────

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = MOCK_TICKET;
  const [comments, setComments] = useState(ticket.comments);
  const [status, setStatus] = useState(ticket.status);

  const statusCfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  const priorityCfg = PRIORITY_CONFIG[ticket.priority as keyof typeof PRIORITY_CONFIG];

  const handleAddComment = (body: string, isInternal: boolean) => {
    const newComment = {
      id: `c-${Date.now()}`,
      user: { id: "u1", name: "Admin HelpDesk", role: "admin" as const, email: "", created_at: "", updated_at: "" },
      body,
      is_internal: isInternal,
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    toast.success("Comentário adicionado!");
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    toast.success(`Status alterado para "${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label}"`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/tickets"
          className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono font-medium text-foreground">{ticket.id}</span>
            <span>·</span>
            <span>{ticket.category.name}</span>
            <span>·</span>
            <span>Criado {formatRelativeDate(ticket.created_at)}</span>
          </div>
          <h1 className="mt-1 text-xl font-semibold leading-snug text-foreground">
            {ticket.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusCfg.class)}>
              {statusCfg.label}
            </span>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", priorityCfg.class)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", priorityCfg.dot)} />
              {priorityCfg.label}
            </span>
          </div>
        </div>
        <Link
          href={`/tickets/${ticket.id}/edit`}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Edit3 size={12} /> Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
          >
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertCircle size={14} className="text-muted-foreground" />
              Descrição do Problema
            </h2>
            <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert">
              {ticket.description.split("\n").map((line, i) => (
                <p key={i} className={cn("leading-relaxed", line.startsWith("**") ? "font-semibold" : "")}>
                  {line.replace(/\*\*/g, "") || <br />}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="rounded-xl border border-border bg-background shadow-card-sm"
          >
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <MessageSquare size={14} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold">
                Comentários ({comments.length})
              </h2>
            </div>

            <div className="divide-y divide-border">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={cn(
                    "px-5 py-4",
                    comment.is_internal && "bg-amber-50/50 dark:bg-amber-950/10"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={comment.user.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeDate(comment.created_at)}
                        </span>
                        {comment.is_internal && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <Lock size={9} /> Nota Interna
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-5 py-4">
              <div className="flex items-start gap-3">
                <Avatar name="Admin HelpDesk" />
                <div className="flex-1">
                  <CommentForm onSubmit={handleAddComment} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="rounded-xl border border-border bg-background shadow-card-sm"
          >
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <History size={14} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold">Histórico de Alterações</h2>
            </div>
            <div className="divide-y divide-border">
              {ticket.history.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                  <Avatar name={entry.user.name} size="sm" />
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{entry.user.name}</span>{" "}
                      <span className="text-muted-foreground">{entry.description}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="rounded-xl border border-border bg-background p-4 shadow-card-sm"
          >
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Detalhes
            </h3>
            <div className="space-y-3">
              {/* Status change */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                >
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="resolved">Resolvido</option>
                  <option value="closed">Fechado</option>
                </select>
              </div>

              {/* Reporter */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Solicitante</label>
                <div className="flex items-center gap-2">
                  <Avatar name={ticket.reporter.name} size="sm" />
                  <div>
                    <p className="text-xs font-medium">{ticket.reporter.name}</p>
                    <p className="text-xs text-muted-foreground">{ticket.reporter.department}</p>
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Responsável</label>
                {ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={ticket.assignee.name} size="sm" />
                    <div>
                      <p className="text-xs font-medium">{ticket.assignee.name}</p>
                      <p className="text-xs text-muted-foreground">{ticket.assignee.department}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Não atribuído</span>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Categoria</label>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ticket.category.color }} />
                  <span className="text-xs">{ticket.category.name}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="border-t border-border pt-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Criado em</span>
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Atualizado</span>
                    <span>{formatRelativeDate(ticket.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="rounded-xl border border-border bg-background p-4 shadow-card-sm"
          >
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => { handleStatusChange("resolved"); toast.success("Chamado marcado como resolvido!"); }}
                className="flex w-full items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400"
              >
                <CheckCircle2 size={12} />
                Marcar como Resolvido
              </button>
              <button
                onClick={() => { handleStatusChange("closed"); toast.success("Chamado fechado!"); }}
                className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Clock size={12} />
                Fechar Chamado
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
