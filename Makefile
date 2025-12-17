.PHONY: help dev dev-up dev-down dev-logs prod prod-up prod-down prod-logs prod-build prod-rebuild db-push db-seed clean

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment (postgres + adminer)"
	@echo "  make dev-up       - Start development services in background"
	@echo "  make dev-down     - Stop development services"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Build and start production environment"
	@echo "  make prod-up      - Start production services in background"
	@echo "  make prod-down    - Stop production services"
	@echo "  make prod-logs    - View production logs"
	@echo "  make prod-build   - Build production image"
	@echo "  make prod-rebuild - Rebuild production image (no cache)"
	@echo ""
	@echo "Database:"
	@echo "  make db-push      - Push schema to database (prod)"
	@echo "  make db-seed      - Seed the database (prod)"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        - Remove all containers and volumes"

# Development commands
dev:
	docker compose up

dev-up:
	docker compose up -d

dev-down:
	docker compose down

dev-logs:
	docker compose logs -f

# Production commands
prod: prod-build prod-up
	@echo "Production environment is running at http://localhost:3000"

prod-up:
	docker compose -f docker-compose.prod.yaml up -d

prod-down:
	docker compose -f docker-compose.prod.yaml down

prod-logs:
	docker compose -f docker-compose.prod.yaml logs -f

prod-logs-app:
	docker compose -f docker-compose.prod.yaml logs -f app

prod-build:
	docker compose -f docker-compose.prod.yaml build

prod-rebuild:
	docker compose -f docker-compose.prod.yaml build --no-cache

prod-restart:
	docker compose -f docker-compose.prod.yaml restart app

# Database commands (run against production containers)
db-push:
	docker compose -f docker-compose.prod.yaml exec app prisma db push

db-seed:
	docker compose -f docker-compose.prod.yaml exec app tsx prisma/seed.ts

db-studio:
	@echo "Opening Prisma Studio - make sure DATABASE_URL is set locally"
	npx prisma studio

# Cleanup
clean:
	docker compose down -v
	docker compose -f docker-compose.prod.yaml down -v
	@echo "Cleaned up all containers and volumes"

clean-images:
	docker compose -f docker-compose.prod.yaml down --rmi local
	@echo "Removed local images"
