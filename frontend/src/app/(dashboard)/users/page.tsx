"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Users List Page
// Team management with roles and stats
// ─────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  User,
  UserCheck,
  Ticket,
  Edit3,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { cn, getInitials, getAvatarColor, formatRelativeDate } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// ── Mock data ─────────────────────────────────

const MOCK_USERS = [
  {
    id: "u1",
    name: "Admin HelpDesk",
    email: "admin@helpdesk.pro",
    role: "admin" as const,
    department: "TI",
    tickets_assigned: 0,
    tickets_resolved: 48,
    created_at: "2024-01-10T08:00:00Z",
  },
  {
    id: "u2",
    name: "Ana Oliveira",
    email: "agent@helpdesk.pro",
    role: "agent" as const,
    department: "Suporte",
    tickets_assigned: 12,
    tickets_resolved: 94,
    created_at: "2024-02-15T10:00:00Z",
  },
  {
    id: "u4",
    name: "Rafael Costa",
    email: "rafael@helpdesk.pro",
    role: "agent" as const,
    department: "Suporte",
    tickets_assigned: 8,
    tickets_resolved: 67,
    created_at: "2024-03-01T09:00:00Z",
  },
  {
    id: "u7",
    name: "Fernanda Lima",
    email: "fernanda@helpdesk.pro",
    role: "agent" as const,
    department: "Suporte",
    tickets_assigned: 5,
    tickets_resolved: 31,
    created_at: "2024-06-01T11:00:00Z",
  },
  {
    id: "u3",
    name: "Carlos Silva",
    email: "user@helpdesk.pro",
    role: "user" as const,
    department: "Financeiro",
    tickets_assigned: 0,
    tickets_resolved: 0,
    created_at: "2024-01-20T14:00:00Z",
  },
  {
    id: "u5",
    name: "Lucia Mendes",
    email: "lucia@helpdesk.pro",
    role: "user" as const,
    department: "RH",
    tickets_assigned: 0,
    tickets_resolved: 0,
    created_at: "2024-04-10T08:30:00Z",
  },
  {
    id: "u8",
    name: "Pedro Alves",
    email: "pedro@helpdesk.pro",
    role: "user" as const,
    department: "Comercial",
    tickets_assigned: 0,
    tickets_resolved: 0,
    created_at: "2024-05-20T13:00:00Z",
  },
  {
    id: "u9",
    name: "Mariana Ramos",
    email: "mariana@helpdesk.pro",
    role: "user" as const,
    department: "Marketing",
    tickets_assigned: 0,
    tickets_resolved: 0,
    created_at: "2024-07-01T10:00:00Z",
  },
];

type Role = "admin" | "agent" | "user";

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ElementType; class: string }> = {
  admin: {
    label: "Administrador",
    icon: Shield,
    class: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
  },
  agent: {
    label: "Agente",
    icon: UserCheck,
    class: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  },
  user: {
    label: "Usuário",
    icon: User,
    class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

// ── Row actions menu ──────────────────────────

function RowMenu({ user, onDelete }: { user: (typeof MOCK_USERS)[0]; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-accent hover:text-foreground"
      >
        <MoreHorizontal size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.1 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-border bg-background py-1 shadow-card-md"
          >
            <Link
              href={`/users/${user.id}`}
              className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent"
            >
              <Edit3 size={12} /> Editar
            </Link>
            <button
              onClick={() => { onDelete(user.id); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={12} /> Remover
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Stats summary ─────────────────────────────

function StatCard({ value, label, icon: Icon, color }: {
  value: number | string;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-card-sm">
      <div className={cn("rounded-lg p-2.5", color)}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("Usuário removido.");
  };

  const admins = users.filter((u) => u.role === "admin").length;
  const agents = users.filter((u) => u.role === "agent").length;
  const regularUsers = users.filter((u) => u.role === "user").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            {users.length} membros na plataforma
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95">
          <Plus size={14} />
          Novo Usuário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard value={users.length} label="Total de usuários" icon={User} color="bg-brand-500" />
        <StatCard value={admins} label="Administradores" icon={Shield} color="bg-violet-500" />
        <StatCard value={agents} label="Agentes" icon={UserCheck} color="bg-sky-500" />
        <StatCard value={regularUsers} label="Usuários" icon={User} color="bg-slate-500" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou departamento..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="all">Todos os papéis</option>
          <option value="admin">Administrador</option>
          <option value="agent">Agente</option>
          <option value="user">Usuário</option>
        </select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-xl border border-border bg-background shadow-card-sm"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="py-3 pl-5 pr-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Usuário
              </th>
              <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Papel
              </th>
              <th className="hidden py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">
                Departamento
              </th>
              <th className="hidden py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">
                Chamados
              </th>
              <th className="hidden py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">
                Membro desde
              </th>
              <th className="py-3 pr-5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    Nenhum usuário encontrado.
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((user, i) => {
                const roleCfg = ROLE_CONFIG[user.role];
                const RoleIcon = roleCfg.icon;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group border-b border-border bg-background transition-colors hover:bg-muted/30"
                  >
                    {/* Avatar + name */}
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                            getAvatarColor(user.name)
                          )}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail size={10} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 pr-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", roleCfg.class)}>
                        <RoleIcon size={10} />
                        {roleCfg.label}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="hidden py-3.5 pr-4 text-sm text-muted-foreground sm:table-cell">
                      {user.department || "—"}
                    </td>

                    {/* Tickets */}
                    <td className="hidden py-3.5 pr-4 md:table-cell">
                      {user.role !== "user" ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Ticket size={10} />
                            {user.tickets_assigned} ativos · {user.tickets_resolved} resolvidos
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </td>

                    {/* Created at */}
                    <td className="hidden py-3.5 pr-4 text-xs text-muted-foreground lg:table-cell">
                      {formatRelativeDate(user.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-5">
                      <div className="flex justify-end">
                        <RowMenu user={user} onDelete={handleDelete} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Mostrando {filtered.length} de {users.length} usuários
          </p>
        </div>
      </motion.div>
    </div>
  );
}
