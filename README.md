# 🎯 HelpDesk Pro

> Sistema de gestão de chamados técnicos moderno e escalável — construído para portfólio com aparência de produto real.

![HelpDesk Pro Banner](https://placehold.co/1280x400/0f172a/e2e8f0?text=HelpDesk+Pro+—+Sistema+de+Chamados+Técnicos)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red?logo=laravel)](https://laravel.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)

---

## 📋 Sobre o Projeto

O **HelpDesk Pro** é uma plataforma SaaS de gestão de chamados técnicos projetada para pequenas empresas, freelancers e equipes de suporte. O sistema oferece um fluxo completo desde a abertura até a resolução de tickets, com dashboard analítico, histórico de interações e controle de acesso por perfis.

Este projeto foi desenvolvido como **projeto principal de portfólio**, com foco em:
- Qualidade visual premium (design system próprio, dark mode, animações)
- Arquitetura escalável e bem separada (feature-based, clean architecture)
- Integração real frontend ↔ backend via REST API
- Boas práticas de UX/UI, acessibilidade e responsividade

---

## ✨ Funcionalidades

### Frontend
- [x] Landing page com hero, features, depoimentos e CTA
- [x] Autenticação (login, cadastro, recuperação de senha)
- [x] Dashboard com métricas, gráficos e KPIs
- [x] CRUD completo de chamados com filtros avançados
- [x] Página de detalhe do chamado com histórico e comentários
- [x] Gerenciamento de usuários e perfil
- [x] Configurações do sistema (tema, notificações)
- [x] Dark mode persistido no localStorage
- [x] Loading states e skeleton screens
- [x] Empty states e feedback visual (toasts)
- [x] Paginação e busca dinâmica
- [x] Responsividade total (mobile, tablet, desktop)

### Backend
- [x] API REST com Laravel 11
- [x] Autenticação via Laravel Sanctum (tokens)
- [x] CRUD de tickets, categorias, comentários, usuários
- [x] Middleware de autorização por papéis (admin, agent, user)
- [x] Paginação, filtros e busca full-text
- [x] Seeders com dados de demonstração
- [x] Validações robustas nos request handlers

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | Next.js (App Router) | 14.x |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 3.x |
| Componentes | shadcn/ui + Radix UI | latest |
| Gráficos | Recharts | 2.x |
| State | Zustand + React Query | latest |
| Backend | Laravel | 11.x |
| Linguagem | PHP | 8.3 |
| Banco de dados | PostgreSQL | 16 |
| Auth | Laravel Sanctum | latest |
| ORM | Eloquent | built-in |

---

## 🗂️ Estrutura de Pastas

```
helpdesk-pro/
├── frontend/                    # Aplicação Next.js
│   ├── src/
│   │   ├── app/                 # App Router (Next.js 14)
│   │   │   ├── (auth)/          # Grupo de rotas autenticadas
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/     # Layout do painel
│   │   │   │   ├── dashboard/
│   │   │   │   ├── tickets/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   └── new/
│   │   │   │   ├── users/
│   │   │   │   └── settings/
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/
│   │   │   ├── ui/              # Primitivos (Button, Input, Badge...)
│   │   │   ├── layout/          # Sidebar, Navbar, Footer
│   │   │   ├── dashboard/       # Widgets do dashboard
│   │   │   ├── tickets/         # Componentes de ticket
│   │   │   └── auth/            # Formulários de auth
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utils, api client, formatters
│   │   ├── store/               # Zustand stores
│   │   └── types/               # TypeScript interfaces
│   ├── public/
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
├── backend/                     # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # TicketController, UserController...
│   │   │   ├── Middleware/      # Auth, Role-based access
│   │   │   └── Requests/        # FormRequest validations
│   │   ├── Models/              # Eloquent models
│   │   └── Services/            # Business logic layer
│   ├── database/
│   │   ├── migrations/          # Schema de tabelas
│   │   └── seeders/             # Dados de demonstração
│   ├── routes/
│   │   └── api.php              # Rotas da API
│   └── .env.example
│
└── README.md
```

---

## 🗄️ Modelo de Banco de Dados

```
users
├── id (uuid)
├── name
├── email (unique)
├── password
├── avatar_url
├── role (admin | agent | user)
├── department
└── timestamps

tickets
├── id (uuid)
├── title
├── description (text)
├── status (open | in_progress | resolved | closed)
├── priority (low | medium | high | critical)
├── category_id (FK)
├── assignee_id (FK → users)
├── reporter_id (FK → users)
└── timestamps

categories
├── id
├── name
├── color
└── icon

comments
├── id (uuid)
├── ticket_id (FK)
├── user_id (FK)
├── body (text)
├── is_internal (boolean)
└── timestamps

ticket_history
├── id
├── ticket_id (FK)
├── user_id (FK)
├── action (string)
├── from_value
├── to_value
└── created_at
```

---

## 🔌 Endpoints da API

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/tickets              ?status=&priority=&search=&page=
POST   /api/tickets
GET    /api/tickets/{id}
PUT    /api/tickets/{id}
DELETE /api/tickets/{id}

GET    /api/tickets/{id}/comments
POST   /api/tickets/{id}/comments

GET    /api/users
GET    /api/users/{id}
PUT    /api/users/{id}

GET    /api/categories
GET    /api/dashboard/stats
GET    /api/dashboard/charts
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 20+
- PHP 8.3+
- Composer
- PostgreSQL 16+

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
# Acesse http://localhost:3000
```

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure o banco no .env:
# DB_CONNECTION=pgsql
# DB_DATABASE=helpdesk_pro
# DB_USERNAME=postgres
# DB_PASSWORD=sua_senha

php artisan migrate --seed
php artisan serve
# API disponível em http://localhost:8000/api
```

### Credenciais de Demo

| Perfil | Email | Senha |
|---|---|---|
| Admin | admin@helpdesk.pro | password |
| Agente | agent@helpdesk.pro | password |
| Usuário | user@helpdesk.pro | password |

---

## 📸 Screenshots

| Landing Page | Dashboard | Tickets |
|---|---|---|
| Hero section moderna | Métricas e gráficos | Lista com filtros |

---

## 🎨 Design System

- **Cores**: Paleta azul-slate com acento em indigo
- **Tipografia**: Geist Sans (display) + Inter (body)
- **Espaçamento**: Escala de 4px base
- **Componentes**: shadcn/ui com customizações
- **Dark Mode**: CSS variables com classe `dark` no `<html>`
- **Animações**: Framer Motion para transições de página

---

## 👨‍💻 Autor

Desenvolvido como projeto de portfólio para demonstrar habilidades em desenvolvimento web full-stack moderno.

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Laravel, PostgreSQL
- DevOps: Estrutura pronta para deploy em Vercel + Railway

---

## 📄 Licença

MIT — livre para uso e adaptação.
