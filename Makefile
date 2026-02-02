# ============================================================================
# KNOWTIS MONOREPO MAKEFILE
# ============================================================================
# Usage: make <target>
# Run 'make help' to see all available commands
# ============================================================================

.PHONY: help install dev dev-api dev-all build build-api test lint format \
        docker-up docker-down db-push db-generate db-migrate db-studio \
        clean typecheck graph storybook preview prepare

# Default target
.DEFAULT_GOAL := help

# Colors for terminal output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m
BOLD := \033[1m

# ============================================================================
# HELP
# ============================================================================

help: ## Show this help message
	@echo ""
	@echo "$(BOLD)$(CYAN)╔══════════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(BOLD)$(CYAN)║                    KNOWTIS MONOREPO                              ║$(RESET)"
	@echo "$(BOLD)$(CYAN)╚══════════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BOLD)Usage:$(RESET) make $(GREEN)<target>$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; section=""} \
		/^##@/ { section=substr($$0, 5); printf "\n$(BOLD)$(YELLOW)%s$(RESET)\n", section } \
		/^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""

# ============================================================================
# SETUP & INSTALLATION
# ============================================================================
##@ Setup

install: ## Install all dependencies
	@echo "$(CYAN)📦 Installing dependencies...$(RESET)"
	pnpm install

prepare: ## Setup git hooks (husky)
	@echo "$(CYAN)🔧 Setting up git hooks...$(RESET)"
	pnpm prepare

setup: install docker-up db-push ## Full setup: install deps, start DB, push schema
	@echo "$(GREEN)✅ Setup complete! Run 'make dev-all' to start developing$(RESET)"

# ============================================================================
# DEVELOPMENT
# ============================================================================
##@ Development

dev: ## Start Notes frontend (http://localhost:4200)
	@echo "$(CYAN)🚀 Starting Notes app...$(RESET)"
	pnpm dev

dev-api: ## Start API backend (http://localhost:3333)
	@echo "$(CYAN)🚀 Starting API server...$(RESET)"
	pnpm dev:api

dev-all: ## Start both frontend and API simultaneously
	@echo "$(CYAN)🚀 Starting all services...$(RESET)"
	pnpm dev:all

serve: ## Alias for dev-all
	@$(MAKE) dev-all

# ============================================================================
# BUILD & PRODUCTION
# ============================================================================
##@ Build

build: ## Build Notes app for production
	@echo "$(CYAN)🔨 Building Notes app...$(RESET)"
	pnpm build

build-api: ## Build API for production
	@echo "$(CYAN)🔨 Building API...$(RESET)"
	pnpm build:api

build-all: build build-api ## Build all projects
	@echo "$(GREEN)✅ All projects built successfully$(RESET)"

preview: ## Preview production build of Notes app
	@echo "$(CYAN)👁️  Previewing production build...$(RESET)"
	pnpm preview

# ============================================================================
# TESTING
# ============================================================================
##@ Testing

test: ## Run all tests in watch mode
	@echo "$(CYAN)🧪 Running tests...$(RESET)"
	pnpm test

test-run: ## Run all tests once (no watch)
	@echo "$(CYAN)🧪 Running tests (single run)...$(RESET)"
	pnpm test:run

test-coverage: ## Run tests with coverage report
	@echo "$(CYAN)📊 Running tests with coverage...$(RESET)"
	pnpm test:coverage

test-notes: ## Run Notes app tests
	@echo "$(CYAN)🧪 Testing Notes app...$(RESET)"
	npx nx test notes

test-api: ## Run API tests
	@echo "$(CYAN)🧪 Testing API...$(RESET)"
	npx nx test api

# ============================================================================
# CODE QUALITY
# ============================================================================
##@ Code Quality

lint: ## Lint all projects
	@echo "$(CYAN)🔍 Linting code...$(RESET)"
	pnpm lint

lint-fix: ## Fix auto-fixable lint issues
	@echo "$(CYAN)🔧 Fixing lint issues...$(RESET)"
	pnpm lint:fix

format: ## Format code with Prettier
	@echo "$(CYAN)✨ Formatting code...$(RESET)"
	pnpm format

format-check: ## Check code formatting
	@echo "$(CYAN)🔍 Checking formatting...$(RESET)"
	pnpm format:check

typecheck: ## Run TypeScript type checking
	@echo "$(CYAN)📝 Type checking...$(RESET)"
	pnpm typecheck

check: lint typecheck test-run ## Run all checks (lint, typecheck, tests)
	@echo "$(GREEN)✅ All checks passed!$(RESET)"

# ============================================================================
# DATABASE
# ============================================================================
##@ Database

db-push: ## Push schema changes to database (development)
	@echo "$(CYAN)📤 Pushing database schema...$(RESET)"
	pnpm db:push

db-generate: ## Generate migration files
	@echo "$(CYAN)📝 Generating migrations...$(RESET)"
	pnpm db:generate

db-migrate: ## Run database migrations
	@echo "$(CYAN)🔄 Running migrations...$(RESET)"
	pnpm db:migrate

db-studio: ## Open Drizzle Studio GUI
	@echo "$(CYAN)🎛️  Opening Drizzle Studio...$(RESET)"
	pnpm db:studio

db-reset: docker-down docker-up db-push ## Reset database (recreate containers + push schema)
	@echo "$(GREEN)✅ Database reset complete$(RESET)"

# ============================================================================
# DOCKER & INFRASTRUCTURE
# ============================================================================
##@ Infrastructure

docker-up: ## Start PostgreSQL and Redis containers
	@echo "$(CYAN)🐳 Starting Docker containers...$(RESET)"
	pnpm docker:up
	@echo "$(GREEN)✅ PostgreSQL: localhost:5432$(RESET)"
	@echo "$(GREEN)✅ Redis: localhost:6379$(RESET)"

docker-down: ## Stop Docker containers
	@echo "$(CYAN)🐳 Stopping Docker containers...$(RESET)"
	pnpm docker:down

docker-logs: ## View Docker container logs
	@echo "$(CYAN)📋 Docker logs...$(RESET)"
	docker compose logs -f

docker-ps: ## Show running containers
	@echo "$(CYAN)📋 Running containers...$(RESET)"
	docker compose ps

# ============================================================================
# NX WORKSPACE
# ============================================================================
##@ Nx Workspace

graph: ## Visualize dependency graph
	@echo "$(CYAN)📊 Opening dependency graph...$(RESET)"
	pnpm graph

affected-test: ## Test only affected projects
	@echo "$(CYAN)🧪 Testing affected projects...$(RESET)"
	pnpm affected:test

affected-lint: ## Lint only affected projects
	@echo "$(CYAN)🔍 Linting affected projects...$(RESET)"
	pnpm affected:lint

affected-build: ## Build only affected projects
	@echo "$(CYAN)🔨 Building affected projects...$(RESET)"
	pnpm affected:build

# ============================================================================
# DESIGN SYSTEM
# ============================================================================
##@ Design System

storybook: ## Start Storybook for design system
	@echo "$(CYAN)📚 Starting Storybook...$(RESET)"
	pnpm storybook

storybook-build: ## Build Storybook for production
	@echo "$(CYAN)📚 Building Storybook...$(RESET)"
	pnpm storybook:build

tokens-build: ## Build design tokens
	@echo "$(CYAN)🎨 Building design tokens...$(RESET)"
	pnpm tokens:build

# ============================================================================
# UTILITIES
# ============================================================================
##@ Utilities

clean: ## Clean build artifacts and node_modules
	@echo "$(YELLOW)🧹 Cleaning project...$(RESET)"
	rm -rf dist
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf libs/*/node_modules
	rm -rf .nx
	@echo "$(GREEN)✅ Clean complete$(RESET)"

clean-dist: ## Clean only build artifacts
	@echo "$(YELLOW)🧹 Cleaning dist folder...$(RESET)"
	rm -rf dist
	@echo "$(GREEN)✅ Dist cleaned$(RESET)"

update-deps: ## Update all dependencies
	@echo "$(CYAN)📦 Updating dependencies...$(RESET)"
	pnpm update

outdated: ## Check for outdated dependencies
	@echo "$(CYAN)📋 Checking outdated packages...$(RESET)"
	pnpm outdated

# ============================================================================
# QUICK WORKFLOWS
# ============================================================================
##@ Quick Workflows

start: docker-up dev-all ## Quick start: start DB + all apps
	@echo ""

fresh: clean install docker-up db-push ## Fresh install: clean, install, setup DB
	@echo "$(GREEN)✅ Fresh install complete! Run 'make dev-all' to start$(RESET)"

ci: install lint typecheck test-run build-all ## Run full CI pipeline locally
	@echo "$(GREEN)✅ CI pipeline passed!$(RESET)"

# ============================================================================
# PROJECT INFO
# ============================================================================
##@ Info

info: ## Show project information
	@echo ""
	@echo "$(BOLD)$(CYAN)Knowtis Monorepo$(RESET)"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "$(BOLD)Apps:$(RESET)"
	@echo "  • notes    - React frontend (Vite)"
	@echo "  • api      - NestJS backend"
	@echo ""
	@echo "$(BOLD)Libraries:$(RESET)"
	@echo "  • api-client     - HTTP/WebSocket client"
	@echo "  • data-access    - Domain logic & state"
	@echo "  • design-system  - UI components"
	@echo "  • shared         - Common utilities"
	@echo ""
	@echo "$(BOLD)URLs (development):$(RESET)"
	@echo "  • Frontend:  http://localhost:4200"
	@echo "  • API:       http://localhost:3333/api"
	@echo "  • WebSocket: ws://localhost:3333"
	@echo "  • PostgreSQL: localhost:5432"
	@echo "  • Redis:     localhost:6379"
	@echo ""

versions: ## Show tool versions
	@echo "$(BOLD)Tool Versions:$(RESET)"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Node.js: $$(node --version)"
	@echo "pnpm:    $$(pnpm --version)"
	@echo "Nx:      $$(npx nx --version)"
	@echo "Docker:  $$(docker --version | cut -d' ' -f3 | tr -d ',')"
	@echo ""
