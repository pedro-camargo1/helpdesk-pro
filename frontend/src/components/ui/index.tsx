// ─────────────────────────────────────────────
// HelpDesk Pro — Reusable UI Components
// Button, Badge, Input, Card, Skeleton, Modal,
// Avatar, EmptyState, LoadingSpinner
// ─────────────────────────────────────────────

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { cn, getInitials, getAvatarColor } from "@/lib/utils";
import type { TicketStatus, TicketPriority, User } from "@/types";

// ─────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ElementType;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon: Icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-border hover:bg-accent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon ? (
        <Icon size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />
      ) : null}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────

const STATUS_MAP: Record<TicketStatus, { label: string; class: string }> = {
  open:        { label: "Aberto",       class: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  in_progress: { label: "Em Andamento", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  resolved:    { label: "Resolvido",    class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  closed:      { label: "Fechado",      class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
};

const PRIORITY_MAP: Record<TicketPriority, { label: string; dot: string; class: string }> = {
  critical: { label: "Crítica", dot: "bg-red-500",    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  high:     { label: "Alta",    dot: "bg-orange-500", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  medium:   { label: "Média",   dot: "bg-amber-400",  class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  low:      { label: "Baixa",   dot: "bg-green-500",  class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.class)}>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const cfg = PRIORITY_MAP[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.class)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────

interface AvatarProps {
  user: Pick<User, "name" | "avatar_url">;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ user, size = "sm", className }: AvatarProps) {
  const sizes = { xs: "h-5 w-5 text-xs", sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" };

  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.name}
        className={cn("flex-shrink-0 rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizes[size],
        getAvatarColor(user.name),
        className
      )}
    >
      {getInitials(user.name)}
    </div>
  );
}

// ─────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export function Card({ children, className, padding = true, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background shadow-card-sm",
        padding && "p-5",
        hover && "card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded", className)} />;
}

export function SkeletonCard() {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </Card>
  );
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="py-3.5 pl-5 pr-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </td>
      {[120, 80, 90, 60].map((w, i) => (
        <td key={i} className="py-3.5 pr-4">
          <Skeleton className={`h-4 w-[${w}px]`} />
        </td>
      ))}
    </tr>
  );
}

// ─────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-3 rounded-full bg-muted p-4">
          <Icon size={24} className="text-muted-foreground" />
        </div>
      )}
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LoadingSpinner
// ─────────────────────────────────────────────

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

// ─────────────────────────────────────────────
// Modal / Dialog
// ─────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

export function Modal({ open, onClose, title, description, children, maxWidth = "md" }: ModalProps) {
  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "w-full rounded-2xl border border-border bg-background shadow-card-md",
                widths[maxWidth]
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border p-5">
                <div>
                  <h2 className="text-base font-semibold">{title}</h2>
                  {description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              {/* Content */}
              <div className="p-5">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// Alert Banner
// ─────────────────────────────────────────────

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
}

const ALERT_STYLES = {
  info:    { class: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300", icon: Info },
  success: { class: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300", icon: CheckCircle },
  warning: { class: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300", icon: AlertTriangle },
  error:   { class: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300", icon: XCircle },
};

export function Alert({ type = "info", title, children, onDismiss }: AlertProps) {
  const cfg = ALERT_STYLES[type];
  const Icon = cfg.icon;

  return (
    <div className={cn("flex gap-3 rounded-lg border p-4 text-sm", cfg.class)}>
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <div className={cn(title && "mt-0.5 text-xs opacity-90")}>{children}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  perPage,
  onPageChange,
}: PaginationProps) {
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <p className="text-xs text-muted-foreground">
        Mostrando {from}–{to} de {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded px-2.5 py-1.5 text-xs transition-colors hover:bg-accent disabled:opacity-40"
        >
          ← Anterior
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-[28px] rounded px-2 py-1 text-xs transition-colors",
                page === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded px-2.5 py-1.5 text-xs transition-colors hover:bg-accent disabled:opacity-40"
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
