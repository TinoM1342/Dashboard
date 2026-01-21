PORT := 5432

free-port:
	@echo "Ensuring ports 5432 and 5173 are free..."
	@if sudo lsof -i :5432 > /dev/null 2>&1; then \
		echo "Port 5432 in use → killing processes..."; \
		sudo kill -9 $$(sudo lsof -t -i :5432) 2>/dev/null || true; \
		sleep 2; \
	else \
		echo "Port 5432 appears free."; \
	fi
	@sudo systemctl stop postgresql >/dev/null 2>&1 || true
	@if sudo lsof -i :5173 > /dev/null 2>&1; then \
		echo "Port 5173 in use → killing processes..."; \
		sudo kill -9 $$(sudo lsof -t -i :5173) 2>/dev/null || true; \
		sleep 2; \
	else \
		echo "Port 5173 appears free."; \
	fi
	@sleep 1
	@echo "Final check:"
	@sudo lsof -i :5432 -i :5173 || echo "Ports are clear."

build:
	docker compose build

up: free-port
	docker compose up -d

# The main command for checking the application – fully Docker-based
test: free-port up
	@echo "Running E2E tests inside Docker container..."
	@docker compose run --rm e2e-tests || true
	@echo ""
	@echo "Tests complete. Report saved to: ./frontendproject/frontend/playwright-report"
	@echo "Open manually: xdg-open ./frontendproject/frontend/playwright-report/index.html || open ./frontendproject/frontend/playwright-report/index.html"

stop:
	@docker compose stop

clean:
	@docker compose down -v --remove-orphans