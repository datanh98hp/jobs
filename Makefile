.PHONY: help dev test prod build clean logs stop start health

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Docker Compose Commands$(NC)"
	@echo "$(BLUE)========================$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Development Commands
dev: ## Start development environment with hot reload
	@echo "$(GREEN)Starting Development Environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.develop.yml up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "$(BLUE)Access application at http://localhost:3000$(NC)"

dev-build: ## Build development environment from scratch
	@echo "$(GREEN)Building Development Environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.develop.yml up --build -d

dev-logs: ## View development logs
	@docker-compose -f docker-compose.yml -f docker-compose.develop.yml logs -f app

dev-mongo-logs: ## View MongoDB logs in development
	@docker-compose -f docker-compose.yml -f docker-compose.develop.yml logs -f mongodb

dev-stop: ## Stop development environment
	@echo "$(RED)Stopping Development Environment...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.develop.yml down
	@echo "$(GREEN)Development environment stopped!$(NC)"

dev-clean: ## Remove development containers and volumes
	@echo "$(RED)Removing Development Environment...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.develop.yml down -v
	@echo "$(GREEN)Development environment removed!$(NC)"

dev-shell: ## Open app shell in development
	@docker exec -it job_app_dev sh

dev-mongo-shell: ## Open MongoDB shell in development
	@docker exec -it job_mongodb_dev mongosh -u admin -p admin123

# Testing Commands
test: ## Start testing environment
	@echo "$(GREEN)Starting Testing Environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d
	@echo "$(GREEN)Testing environment started!$(NC)"
	@echo "$(BLUE)Access application at http://localhost:3001$(NC)"

test-build: ## Build testing environment from scratch
	@echo "$(GREEN)Building Testing Environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build -d

test-logs: ## View testing logs
	@docker-compose -f docker-compose.yml -f docker-compose.test.yml logs -f app

test-stop: ## Stop testing environment
	@echo "$(RED)Stopping Testing Environment...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.test.yml down
	@echo "$(GREEN)Testing environment stopped!$(NC)"

test-clean: ## Remove testing containers and volumes
	@echo "$(RED)Removing Testing Environment...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.test.yml down -v
	@echo "$(GREEN)Testing environment removed!$(NC)"

# Production Commands
prod: ## Start production environment
	@echo "$(GREEN)Starting Production Environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "$(GREEN)Production environment started!$(NC)"
	@echo "$(BLUE)Access application at https://yourdomain.com$(NC)"

prod-build: ## Build production environment from scratch
	@echo "$(GREEN)Building Production Environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

prod-logs: ## View production logs
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f app

prod-nginx-logs: ## View Nginx logs in production
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f nginx

prod-stop: ## Stop production environment
	@echo "$(RED)Stopping Production Environment...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
	@echo "$(GREEN)Production environment stopped!$(NC)"

prod-clean: ## Remove production containers and volumes (CAUTION!)
	@echo "$(RED)WARNING: This will remove all production data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v; \
		echo "$(GREEN)Production environment removed!$(NC)"; \
	else \
		echo "Cancelled."; \
	fi

prod-shell: ## Open app shell in production
	@docker exec -it job_app_prod sh

prod-health: ## Check production health
	@echo "$(GREEN)Health Status:$(NC)"
	@curl -s http://localhost/health || echo "$(RED)Unhealthy$(NC)"

# Universal Commands
all-stop: ## Stop all environments
	@echo "$(RED)Stopping all environments...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.develop.yml down 2>/dev/null || true
	@docker-compose -f docker-compose.yml -f docker-compose.test.yml down 2>/dev/null || true
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml down 2>/dev/null || true
	@echo "$(GREEN)All environments stopped!$(NC)"

all-clean: ## Remove all containers and volumes (CAUTION!)
	@echo "$(RED)WARNING: This will remove all containers and volumes!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose -f docker-compose.yml -f docker-compose.develop.yml down -v 2>/dev/null || true; \
		docker-compose -f docker-compose.yml -f docker-compose.test.yml down -v 2>/dev/null || true; \
		docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v 2>/dev/null || true; \
		echo "$(GREEN)All environments removed!$(NC)"; \
	else \
		echo "Cancelled."; \
	fi

ps: ## Show running containers
	@echo "$(BLUE)Running Containers:$(NC)"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

logs: ## View logs from all services
	@docker-compose logs -f

stats: ## Show container resource usage
	@docker stats

health: ## Check health of all services
	@echo "$(BLUE)Checking health of services...$(NC)"
	@echo "$(BLUE)Development App:$(NC)" && curl -s http://localhost:3000/ > /dev/null && echo "$(GREEN)✓ Running$(NC)" || echo "$(RED)✗ Not running$(NC)"
	@echo "$(BLUE)Testing App:$(NC)" && curl -s http://localhost:3001/ > /dev/null && echo "$(GREEN)✓ Running$(NC)" || echo "$(RED)✗ Not running$(NC)"
	@echo "$(BLUE)Production App:$(NC)" && curl -s http://localhost/health > /dev/null && echo "$(GREEN)✓ Running$(NC)" || echo "$(RED)✗ Not running$(NC)"

prune: ## Remove unused Docker images, containers, and volumes
	@echo "$(YELLOW)Pruning Docker system...$(NC)"
	docker system prune -f
	@echo "$(GREEN)Prune completed!$(NC)"

build-prod-image: ## Build production Docker image locally (without compose)
	@echo "$(GREEN)Building production image...$(NC)"
	docker build -t job:latest --target production .
	@echo "$(GREEN)Build completed! Image: job:latest$(NC)"

push-registry: ## Push production image to Docker registry (requires REGISTRY_URL)
	@echo "$(GREEN)Pushing image to registry...$(NC)"
	docker tag job:latest $${REGISTRY_URL}/job:latest
	docker push $${REGISTRY_URL}/job:latest
	@echo "$(GREEN)Push completed!$(NC)"
