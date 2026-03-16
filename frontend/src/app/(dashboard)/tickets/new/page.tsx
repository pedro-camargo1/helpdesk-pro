"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — New Ticket Form
// Controlled form with react-hook-form + zod
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Ticket, AlertTriangle, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// ── Validation schema ─────────────────────────

const createTicketSchema = z.object({
  title: z
    .string()
    .min(5, "Título deve ter pelo menos 5 caracteres")
    .max(120, "Título muito longo (máx. 120 caracteres)"),
  description: z
    .string()
    .min(20, "Descreva o problema com pelo menos 20 caracteres")
    .max(2000, "Descrição muito longa"),
  priority: z.enum(["low", "medium", "high", "critical"], {
    errorMap: () => ({ message: "Selecione uma prioridade" }),
  }),
  category_id: z.string().min(1, "Selecione uma categoria"),
  assignee_id: z.string().optional(),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

// ── Priority selector ─────────────────────────

const PRIORITIES = [
  {
    value: "low",
    label: "Baixa",
    description: "Sem urgência, pode aguardar",
    color: "border-green-500 bg-green-50 dark:bg-green-950/20",
    dot: "bg-green-500",
  },
  {
    value: "medium",
    label: "Média",
    description: "Impacto moderado no trabalho",
    color: "border-amber-500 bg-amber-50 dark:bg-amber-950/20",
    dot: "bg-amber-500",
  },
  {
    value: "high",
    label: "Alta",
    description: "Afeta equipes ou processos",
    color: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
    dot: "bg-orange-500",
  },
  {
    value: "critical",
    label: "Crítica",
    description: "Sistema fora do ar, impacto total",
    color: "border-red-500 bg-red-50 dark:bg-red-950/20",
    dot: "bg-red-500",
  },
];

const CATEGORIES = [
  { id: "1", name: "Infraestrutura", icon: "🖥️" },
  { id: "2", name: "Autenticação", icon: "🔐" },
  { id: "3", name: "Relatórios", icon: "📊" },
  { id: "4", name: "Acessos", icon: "🔑" },
  { id: "5", name: "Performance", icon: "⚡" },
  { id: "6", name: "Banco de Dados", icon: "🗄️" },
  { id: "7", name: "Interface", icon: "🎨" },
  { id: "8", name: "Outros", icon: "📋" },
];

const AGENTS = [
  { id: "u2", name: "Ana Oliveira" },
  { id: "u5", name: "Rafael Costa" },
  { id: "u7", name: "Fernanda Lima" },
];

// ── Form field wrapper ────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle size={10} />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Main Form ─────────────────────────────────

export default function NewTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: "medium",
      category_id: "",
    },
  });

  const selectedPriority = watch("priority");

  const onSubmit = async (data: CreateTicketForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // In production: await ticketsApi.create(data);

      toast.success("Chamado criado com sucesso!");
      setSubmitted(true);
      setTimeout(() => router.push("/tickets"), 1000);
    } catch (error) {
      toast.error("Erro ao criar chamado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
        >
          <Check size={32} className="text-emerald-600" />
        </motion.div>
        <h2 className="mt-4 text-lg font-semibold">Chamado criado!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Redirecionando para a lista de chamados...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/tickets"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Novo Chamado</h1>
          <p className="text-sm text-muted-foreground">
            Preencha os detalhes do problema para abrir um chamado
          </p>
        </div>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-background p-6 shadow-card-sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <Field label="Título do Chamado" error={errors.title?.message} required>
            <input
              {...register("title")}
              placeholder="Ex: Erro ao exportar relatório em PDF..."
              className={cn(
                "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                errors.title
                  ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                  : "border-border focus:border-primary focus:ring-primary/30"
              )}
            />
            <p className="text-right text-xs text-muted-foreground">
              {watch("title")?.length || 0}/120
            </p>
          </Field>

          {/* Description */}
          <Field label="Descrição Detalhada" error={errors.description?.message} required>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Descreva o problema com o máximo de detalhes possível. Inclua mensagens de erro, passos para reproduzir e contexto relevante..."
              className={cn(
                "w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                errors.description
                  ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                  : "border-border focus:border-primary focus:ring-primary/30"
              )}
            />
          </Field>

          {/* Priority selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Prioridade <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setValue("priority", p.value as CreateTicketForm["priority"])}
                  className={cn(
                    "flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all",
                    selectedPriority === p.value
                      ? p.color
                      : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", p.dot)} />
                    <span className="text-sm font-medium">{p.label}</span>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </button>
              ))}
            </div>
            {errors.priority && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertTriangle size={10} />
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Category */}
          <Field label="Categoria" error={errors.category_id?.message} required>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIES.map((cat) => {
                const isSelected = watch("category_id") === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue("category_id", cat.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground/40 text-foreground"
                    )}
                  >
                    <span>{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Assignee */}
          <Field label="Atribuir para" error={errors.assignee_id?.message}>
            <select
              {...register("assignee_id")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              <option value="">Sem responsável (atribuir depois)</option>
              {AGENTS.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </Field>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <Link
              href="/tickets"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Criando...
                </>
              ) : (
                <>
                  <Ticket size={14} />
                  Abrir Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
