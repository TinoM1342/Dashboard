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