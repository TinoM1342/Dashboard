PORT := 5432

free-port:
	@echo "Ensuring port $(DB_HOST_PORT) is free..."
	@if sudo lsof -i :$(DB_HOST_PORT) > /dev/null 2>&1; then \
		echo "Port in use → killing processes..."; \
		sudo kill -9 $$(sudo lsof -t -i :$(DB_HOST_PORT)) 2>/dev/null || true; \
		sleep 2; \
	else \
		echo "Port appears free."; \
	fi
	# Extra: stop local postgres if present
	@sudo systemctl stop postgresql >/dev/null 2>&1 || true
	@sleep 1
	@echo "Final check:"
	@sudo lsof -i :$(DB_HOST_PORT) || echo "Port is clear."

build:
	docker compose build

# Starts the entire application stack (db, backend, frontend) in detached mode
up: free-port
	docker compose up -d

show-report:
	@echo "Opening Playwright test report..."
	@cd frontendproject/frontend && npx playwright show-report || echo "Report not found. Run 'make test' first."

# Runs Playwright E2E tests (assumes tests are in frontendproject/frontend)
test:
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

	@echo "Tests complete. (Services remain running - use 'make stop' to shut down if desired.)"

	show-report
# Stops the running Docker containers
stop:
	docker compose stop

# Removes containers, volumes, and networks for a clean slate
clean:
	docker compose down -v --remove-orphans
