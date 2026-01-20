# Rescale_Dashboard

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

Diagram to be used in a mermaid viewer below:
---
config:
  layout: fixed
---
flowchart TB
 subgraph subGraph0["Host Machine (Your Computer)"]
        DC["docker compose"]
        Make["make up / make test"]
        PW["npx playwright test"]
        NPM["npm run dev → Vite"]
        Report["Playwright HTML Report"]
        Browser["Your Browser"]
  end
 subgraph subGraph1["Docker Network (rescale_dashboard_default)"]
        DB[("Postgres DB<br>port 5432<br>service: db")]
        BE["Django Backend<br>runserver 0.0.0.0:8000<br>service: backend"]
        FE["Vite Frontend<br>dev server<br>port 5173<br>service: frontend"]
  end
    Make -- runs commands --> DC
    Make -- runs --> PW & NPM
    Browser -- opens --> Report
    DC -- starts / manages --> DB & BE & FE
    FE <-- HTTP requests to /api/* (via proxy or localhost:8000) --> BE
    BE <-- psycopg2 connection to port 5432 --> DB
    PW -- controls browser + makes API calls --> FE
    PW -- direct API calls via request fixture --> BE
    Browser -- http://localhost:8000 --> BE
    Browser -- http://localhost:5173 --> FE

     Make:::default
     Make:::host
     DC:::default
     PW:::default
     PW:::host
     NPM:::default
     NPM:::host
     Browser:::default
     Browser:::host
     Report:::default
     Report:::host
     DB:::default
     DB:::db
     BE:::default
     BE:::container
     FE:::default
     FE:::container
    classDef default fill:#ffffff,stroke:#333,stroke-width:2px,color:#000000
    classDef host fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#000000
    classDef container fill:#e6f0ff,stroke:#333,color:#000000
    classDef db fill:#e6ffe6,stroke:#333,color:#000000