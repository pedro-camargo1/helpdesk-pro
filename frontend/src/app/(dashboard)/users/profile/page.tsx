"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — User Profile Page
// Edit personal info, avatar, bio
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Check, AlertTriangle } from "lucide-react";
import { cn, getInitials, getAvatarColor } from "@/lib/utils";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name:       z.string().min(2, "Mínimo 2 caracteres"),
  email:      z.string().email("Email inválido"),
  department: z.string().optional(),
  phone:      z.string().optional(),
  bio:        z.string().max(300, "Máximo 300 caracteres").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

function Field({ label, error, children }: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name:       user?.name ?? "",
      email:      user?.email ?? "",
      department: user?.department ?? "",
      phone:      user?.phone ?? "",
      bio:        user?.bio ?? "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    updateUser(data);
    toast.success("Perfil atualizado com sucesso!");
    setSaving(false);
  };

  const roleBadge: Record<string, { label: string; class: string }> = {
    admin: { label: "Administrador", class: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" },
    agent: { label: "Agente",        class: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
    user:  { label: "Usuário",       class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  };

  const role = roleBadge[user?.role ?? "user"];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-5 rounded-xl border border-border bg-background p-5 shadow-card-sm"
        >
          <div className="relative">
            <div className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white",
              user ? getAvatarColor(user.name) : "bg-slate-400"
            )}>
              {user ? getInitials(user.name) : "?"}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground transition-colors hover:bg-accent"
            >
              <Camera size={12} />
            </button>
          </div>

          <div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className={cn("mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", role.class)}>
              {role.label}
            </span>
          </div>
        </motion.div>

        {/* Info form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
        >
          <h2 className="mb-4 text-sm font-semibold">Informações Pessoais</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome completo" error={errors.name?.message}>
              <input
                {...register("name")}
                className={cn(
                  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                  errors.name ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "border-border focus:border-primary focus:ring-primary/30"
                )}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                className={cn(
                  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-1",
                  errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "border-border focus:border-primary focus:ring-primary/30"
                )}
              />
            </Field>

            <Field label="Departamento" error={errors.department?.message}>
              <input
                {...register("department")}
                placeholder="Ex: Engenharia, RH, Suporte..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </Field>

            <Field label="Telefone" error={errors.phone?.message}>
              <input
                {...register("phone")}
                placeholder="(11) 99999-9999"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Bio" error={errors.bio?.message}>
                <textarea
                  {...register("bio")}
                  rows={3}
                  placeholder="Fale um pouco sobre você e sua função..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {watch("bio")?.length ?? 0}/300
                </p>
              </Field>
            </div>
          </div>
        </motion.div>

        {/* Change password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="rounded-xl border border-border bg-background p-5 shadow-card-sm"
        >
          <h2 className="mb-4 text-sm font-semibold">Alterar Senha</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nova senha</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirmar nova senha</label>
              <input
                type="password"
                placeholder="Repita a nova senha"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-60"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : <Check size={14} />}
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
