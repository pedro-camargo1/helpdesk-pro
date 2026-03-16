import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HelpDesk Pro — Gestão de Chamados Técnicos",
    template: "%s | HelpDesk Pro",
  },
  description:
    "Plataforma SaaS moderna para gestão de chamados e suporte técnico. Dashboard analítico, CRUD completo, autenticação e mais.",
  keywords: ["helpdesk", "suporte técnico", "chamados", "tickets", "gestão"],
  authors: [{ name: "HelpDesk Pro" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "HelpDesk Pro",
    description: "Suporte técnico mais rápido e inteligente.",
    siteName: "HelpDesk Pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "10px",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#6366f1",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
