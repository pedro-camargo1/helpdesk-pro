"use client";

// ─────────────────────────────────────────────
// HelpDesk Pro — Settings Page
// Theme, notifications, preferences
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Mail,
  Globe,
  Shield,
  Palette,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

function SectionCard({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-card-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="rounded-lg bg-muted p-2">
          <Icon size={15} className="text-muted-foreground" />
        </div>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function SettingRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    onAssign: true,
    onComment: true,
    onStatusChange: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    toast.success("Configurações salvas!");
    setTimeout(() => setSaved(false), 2000);
  };

  const THEMES = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Personalize sua experiência no HelpDesk Pro
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        {/* Appearance */}
        <SectionCard title="Aparência" icon={Palette}>
          <div>
            <p className="mb-3 text-xs text-muted-foreground">Tema de exibição</p>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-xs font-medium transition-all",
                    theme === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                  )}
                >
                  <Icon size={18} />
                  {label}
                  {theme === value && <Check size={10} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notificações" icon={Bell}>
          <div className="divide-y divide-border">
            <SettingRow
              label="Notificações por email"
              description="Receba emails sobre atualizações de chamados"
            >
              <Toggle
                checked={notifications.email}
                onChange={(v) => setNotifications((n) => ({ ...n, email: v }))}
              />
            </SettingRow>
            <SettingRow
              label="Notificações no navegador"
              description="Push notifications em tempo real"
            >
              <Toggle
                checked={notifications.browser}
                onChange={(v) => setNotifications((n) => ({ ...n, browser: v }))}
              />
            </SettingRow>
            <SettingRow
              label="Ao ser atribuído a um chamado"
              description="Avise quando um chamado for atribuído a mim"
            >
              <Toggle
                checked={notifications.onAssign}
                onChange={(v) => setNotifications((n) => ({ ...n, onAssign: v }))}
              />
            </SettingRow>
            <SettingRow
              label="Novos comentários"
              description="Avise quando houver comentários em meus chamados"
            >
              <Toggle
                checked={notifications.onComment}
                onChange={(v) => setNotifications((n) => ({ ...n, onComment: v }))}
              />
            </SettingRow>
            <SettingRow
              label="Alterações de status"
              description="Avise quando o status de um chamado mudar"
            >
              <Toggle
                checked={notifications.onStatusChange}
                onChange={(v) => setNotifications((n) => ({ ...n, onStatusChange: v }))}
              />
            </SettingRow>
          </div>
        </SectionCard>

        {/* System */}
        <SectionCard title="Sistema" icon={Globe}>
          <div className="divide-y divide-border">
            <SettingRow label="Idioma" description="Idioma da interface">
              <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary">
                <option>Português (BR)</option>
                <option>English (US)</option>
                <option>Español</option>
              </select>
            </SettingRow>
            <SettingRow label="Fuso horário" description="Para datas e horários">
              <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary">
                <option>America/Sao_Paulo (GMT-3)</option>
                <option>America/Manaus (GMT-4)</option>
                <option>UTC</option>
              </select>
            </SettingRow>
            <SettingRow label="Itens por página" description="Paginação padrão nas listagens">
              <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary">
                <option>15</option>
                <option>25</option>
                <option>50</option>
              </select>
            </SettingRow>
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Segurança" icon={Shield}>
          <div className="divide-y divide-border">
            <SettingRow label="Autenticação de dois fatores" description="Aumenta a segurança da conta">
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent">
                Configurar 2FA
              </button>
            </SettingRow>
            <SettingRow label="Sessões ativas" description="Gerencie dispositivos conectados">
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10">
                Ver sessões
              </button>
            </SettingRow>
          </div>
        </SectionCard>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            {saved ? <Check size={14} /> : null}
            {saved ? "Salvo!" : "Salvar configurações"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
