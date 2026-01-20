build:
	docker compose build

# Starts the entire application stack (db, backend, frontend) in detached mode
up:
	docker compose up -d

# Runs Playwright E2E tests (assumes tests are in frontendproject/frontend)
test:
	cd frontendproject/frontend && npx playwright test

# Stops the running Docker containers
stop:
	docker compose stop

# Removes containers, volumes, and networks for a clean slate
clean:
	docker compose down -v --remove-orphans
