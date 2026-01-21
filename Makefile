PORT := 5432

# ──────────────────────────────────────────────────────────────────────────────
# One-time setup after fresh clone
# ──────────────────────────────────────────────────────────────────────────────

setup: install-frontend-deps install-playwright-browsers
	@echo ""
	@echo "──────────────────────────────────────────────────────────────"
	@echo "Setup complete! You can now run:"
	@echo "  make test        → run E2E tests + open report"
	@echo "  make up          → start the full stack"
	@echo "  make show-report → view last test report (if needed)"
	@echo "──────────────────────────────────────────────────────────────"

install-frontend-deps:
	@echo "Installing frontend dependencies (npm install)..."
	@cd frontendproject/frontend && npm install

install-playwright-browsers:
	@echo "Installing Playwright browsers (this may take a few minutes)..."
	@cd frontendproject/frontend && npx playwright install --with-deps

# ──────────────────────────────────────────────────────────────────────────────
# Core targets
# ──────────────────────────────────────────────────────────────────────────────

free-port:
	@echo "Ensuring port $(PORT) is free..."
	@if sudo lsof -i :$(PORT) > /dev/null 2>&1; then \
		echo "Port in use → killing processes..."; \
		sudo kill -9 $$(sudo lsof -t -i :$(PORT)) 2>/dev/null || true; \
		sleep 2; \
	else \
		echo "Port appears free."; \
	fi
	# Extra: stop local postgres if present
	@sudo systemctl stop postgresql >/dev/null 2>&1 || true
	@sleep 1
	@echo "Final check:"
	@sudo lsof -i :$(PORT) || echo "Port is clear."

build:
	docker compose build

up: setup free-port
	docker compose up -d

# The main command for checking the application
test: setup free-port
	@echo "Checking and preparing services for testing..."
	@if lsof -i :$(PORT) > /dev/null 2>&1; then \
		echo "Freeing port $(PORT)..."; \
		sudo kill -9 $$(lsof -t -i :$(PORT)) 2>/dev/null || true; \
		sleep 1; \
		echo "Port $(PORT) should now be free."; \
	else \
		echo "Port $(PORT) is already free."; \
	fi

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

	@echo "Opening report..."
	@cd frontendproject/frontend && npx playwright show-report || echo "No report generated."

	@echo "Tests complete. (Services remain running - use 'make stop' to shut down if desired.)"

show-report:
	@if [ -d "frontendproject/frontend/playwright-report" ]; then \
		echo "Opening Playwright test report..."; \
		cd frontendproject/frontend && npx playwright show-report; \
	else \
		echo "No report directory found in frontendproject/frontend/playwright-report"; \
		echo "Run 'make test' first to generate one."; \
		exit 1; \
	fi

stop:
	docker compose stop

clean:
	docker compose down -v --remove-orphans