# ─────────────────────────────────────────────
# HelpDesk Pro — Makefile
# Convenience shortcuts for development
# ─────────────────────────────────────────────

.PHONY: help install dev seed test lint

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ── Frontend ──────────────────────────────────

install-fe: ## Install frontend dependencies
	cd frontend && npm install

dev-fe: ## Start frontend dev server
	cd frontend && npm run dev

build-fe: ## Build frontend for production
	cd frontend && npm run build

lint-fe: ## Lint frontend code
	cd frontend && npm run lint

type-check: ## TypeScript type check
	cd frontend && npm run type-check

# ── Backend ───────────────────────────────────

install-be: ## Install backend dependencies
	cd backend && composer install

dev-be: ## Start Laravel dev server
	cd backend && php artisan serve

migrate: ## Run database migrations
	cd backend && php artisan migrate

seed: ## Seed the database with demo data
	cd backend && php artisan db:seed

fresh: ## Fresh migration + seed (⚠️ destroys all data)
	cd backend && php artisan migrate:fresh --seed

test-be: ## Run backend tests
	cd backend && php artisan test

tinker: ## Open Laravel Tinker REPL
	cd backend && php artisan tinker

routes: ## List all API routes
	cd backend && php artisan route:list --path=api

# ── Full stack ────────────────────────────────

install: install-fe install-be ## Install all dependencies

dev: ## Start both dev servers (requires tmux or two terminals)
	@echo "Run in separate terminals:"
	@echo "  make dev-fe   → http://localhost:3000"
	@echo "  make dev-be   → http://localhost:8000"

docker-up: ## Start with Docker Compose
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-seed: ## Seed database inside Docker
	docker-compose exec backend php artisan migrate:fresh --seed

# ── Utils ─────────────────────────────────────

env-fe: ## Copy frontend env example
	cp frontend/.env.local.example frontend/.env.local

env-be: ## Copy backend env example
	cp backend/.env.example backend/.env && cd backend && php artisan key:generate
