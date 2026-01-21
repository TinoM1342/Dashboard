# Dashboard

Problem Approach:
    Sketched on paper diagrams on how to break, order and connect how each component would work. From there ended up following a blog on how to get the backend up and running(https://dev.to/francescoxx/python-crud-rest-api-using-django-postgres-docker-and-docker-compose-4nhe) 

Performance Considerations
    1) To efficiently fetch and display millions of jobs in the database,
        non-clustered covering indexes would used on the job name and current status.
        That way, when retrieved, the look up is expedited. Another way these jobs can be served
        quicker, is via cache helper in 
    
    2) Optimizations made were adding convering indexes to both tables Job and JobStatus,
        doing this opens up the avenue to add more functionality to the app and retrieve
        frequently queried data based upon job name, created_at or status_type.
        
Architecture

Host ──▶ make ──▶ docker compose ──▶ 3 containers:
                     ├─ db (Postgres:5432)
                     ├─ backend (Django:8000) ↔ db
                     └─ frontend (Vite:5173) ↔ backend

Host ──▶ make test ──▶ playwright ──▶ controls browser
                                     ├─ interacts with http://localhost:5173 (frontend)
                                     └─ expects network calls to http://localhost:8000 (backend)

Browser ──▶ http://localhost:8000 ──▶ backend API
Browser ──▶ http://localhost:5173 ──▶ Vite dev UI


AI Prompts Used:

1) I have a Django + React/Vite + Postgres project using Docker Compose.

Current problems:
- Host port 5432 conflict with local PostgreSQL
- Backend cannot resolve "db" hostname ("Temporary failure in name resolution")
- pg_isready and nc are not available in backend container
- Backend crashes on startup before DB is ready

Fix all of this:
- Make Makefile free-port target robust (kill processes on 5432, stop local postgresql service)
- Add wait logic in backend.sh using pure Bash /dev/tcp (no extra packages if possible)
- Update docker-compose.yml to include healthcheck on db and depends_on condition if supported
- Ensure backend starts runserver only after DB is reachable
- Make up and test targets depend on free-port where needed

Provide updated Makefile snippet, backend.sh, and docker-compose.yml parts.

2) My Playwright tests (in frontendproject/frontend/tests/example.spec.ts) fail intermittently on the "Delete a job" test:

TimeoutError: page.waitForResponse timeout waiting for DELETE /api/jobs/... status 204

In headed/debug mode:
- deleteButton.click() runs
- No DELETE request appears in network tab
- UI still shows "No jobs yet" after click
- Happens more in WebKit/Firefox, sometimes passes in Chromium

The delete button is: <button onClick={() => removeJob(job.id)}>Delete</button>

Fix the flakiness:
- Make test more stable (prefer UI assertion over network wait)
- Add logging to see if onClick handler runs
- Improve click reliability (hover, dispatchEvent, force click)
- Suggest console.log in removeJob function
- Update Makefile to easily run single test (e.g. make test-delete)

Provide updated test code snippet and Makefile addition.

3) After fresh git clone, make test fails with:
- vite: not found
- Cannot find package '@playwright/test'

Add to Makefile:
- make setup target that runs npm install + npx playwright install --with-deps in frontendproject/frontend
- Make test and up depend on setup (auto-run if needed)
- Auto-open Playwright report after tests finish (npx playwright show-report)
- Keep existing free-port, stop, clean logic

Provide the full updated Makefile with comments.

4) My Rescale Dashboard project (Django + Postgres + React/Vite + Playwright + Docker + Makefile) is now working.

Create:
- README.md quick-start section:
  - make setup (once after clone)
  - make test (runs E2E + auto-opens report)
  - make up / stop / clean
- Mermaid diagram showing component communication:
  - Host → make → docker compose → db/backend/frontend
  - Frontend ↔ backend API
  - Playwright → frontend UI + backend API
  - Use black text inside containers for readability

Provide the README snippet and full Mermaid code.


Time Spent: 10 hours