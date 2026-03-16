-- ─────────────────────────────────────────────
-- HelpDesk Pro — Database Migrations (PostgreSQL)
-- Run: php artisan migrate --seed
-- ─────────────────────────────────────────────

-- ── users ─────────────────────────────────────
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('admin', 'agent', 'user')),
    department VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    remember_token VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ── personal_access_tokens (Sanctum) ──────────
CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tokens_tokenable ON personal_access_tokens(tokenable_type, tokenable_id);

-- ── categories ────────────────────────────────
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#6366f1',  -- hex color
    icon VARCHAR(50) NOT NULL DEFAULT 'tag',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── tickets ───────────────────────────────────
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP,    -- soft deletes
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_status ON tickets(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_priority ON tickets(priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_category ON tickets(category_id);
CREATE INDEX idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX idx_tickets_reporter ON tickets(reporter_id);
CREATE INDEX idx_tickets_created ON tickets(created_at DESC);

-- Full-text search index
CREATE INDEX idx_tickets_fts ON tickets
    USING GIN (to_tsvector('portuguese', title || ' ' || description));

-- ── comments ──────────────────────────────────
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_ticket ON comments(ticket_id);
CREATE INDEX idx_comments_user ON comments(user_id);

-- ── ticket_history ────────────────────────────
CREATE TABLE ticket_history (
    id BIGSERIAL PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,   -- created | changed_status | changed_priority | changed_assignee
    from_value VARCHAR(100),
    to_value VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_history_ticket ON ticket_history(ticket_id);

-- ─────────────────────────────────────────────
-- Seed Data
-- ─────────────────────────────────────────────

-- Categories
INSERT INTO categories (name, color, icon) VALUES
    ('Infraestrutura',  '#6366f1', 'server'),
    ('Autenticação',    '#f59e0b', 'lock'),
    ('Relatórios',      '#22c55e', 'file-chart'),
    ('Acessos',         '#14b8a6', 'key'),
    ('Performance',     '#8b5cf6', 'zap'),
    ('Banco de Dados',  '#ef4444', 'database'),
    ('Interface',       '#ec4899', 'monitor'),
    ('Outros',          '#64748b', 'tag');

-- Sample users (passwords are bcrypt of "password")
INSERT INTO users (id, name, email, password, role, department) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Admin HelpDesk', 'admin@helpdesk.pro',
     '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'TI'),
    ('00000000-0000-0000-0000-000000000002', 'Ana Oliveira',   'agent@helpdesk.pro',
     '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent', 'Suporte'),
    ('00000000-0000-0000-0000-000000000003', 'Carlos Silva',   'user@helpdesk.pro',
     '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Financeiro'),
    ('00000000-0000-0000-0000-000000000004', 'Rafael Costa',   'rafael@helpdesk.pro',
     '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent', 'Suporte'),
    ('00000000-0000-0000-0000-000000000005', 'Lucia Mendes',   'lucia@helpdesk.pro',
     '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'RH');

-- Sample tickets
INSERT INTO tickets (title, description, status, priority, category_id, reporter_id, assignee_id) VALUES
    ('Servidor de produção fora do ar',
     'O servidor principal está retornando erro 503 para todos os usuários desde as 14h.',
     'in_progress', 'critical', 1,
     '00000000-0000-0000-0000-000000000003',
     '00000000-0000-0000-0000-000000000002'),

    ('Falha de autenticação após atualização',
     'Desde a atualização de ontem, usuários relatam erro 401 ao fazer login.',
     'open', 'high', 2,
     '00000000-0000-0000-0000-000000000005',
     NULL),

    ('Exportação de PDF não funciona',
     'O botão de exportar PDF no módulo financeiro não responde ao clique.',
     'open', 'medium', 3,
     '00000000-0000-0000-0000-000000000003',
     '00000000-0000-0000-0000-000000000004'),

    ('Liberar acesso ao módulo de RH',
     'Novo colaborador João Paulo precisa de acesso ao sistema de RH.',
     'resolved', 'low', 4,
     '00000000-0000-0000-0000-000000000005',
     '00000000-0000-0000-0000-000000000002');
