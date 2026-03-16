// ─────────────────────────────────────────────
// HelpDesk Pro — Auth Layout
// Minimal layout for login/register pages
// ─────────────────────────────────────────────

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticação",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
