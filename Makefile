build:
	docker compose build

# Starts the entire application stack (db, backend, frontend) in detached mode
up:
	docker compose up -d

# Runs Playwright E2E tests (assumes tests are in frontendproject/frontend)
test:
	@echo "Checking and preparing services for testing..."

	# Check if backend container is running
	@if ! docker compose ps --status running | grep -q backend; then \
		echo "Starting backend + DB services..."; \
		docker compose up -d db backend; \
		echo "Waiting for backend to be ready..."; \
		sleep 15; \
	else \
		echo "Backend + DB already running."; \
	fi

	# Check if Vite dev server is already running on port 5173
	@if ! lsof -i :5173 > /dev/null 2>&1; then \
		echo "Starting frontend dev server..."; \
		cd frontendproject/frontend && npm run dev & \
		echo "Waiting for frontend to be ready..."; \
		sleep 10; \
	else \
		echo "Frontend dev server already running."; \
	fi

	@echo "Running Playwright tests..."
	@cd frontendproject/frontend && npx playwright test || true

	@echo "Tests complete. (Services remain running - use 'make stop' to shut down if desired.)"

# Stops the running Docker containers
stop:
	docker compose stop

# Removes containers, volumes, and networks for a clean slate
clean:
	docker compose down -v --remove-orphans
