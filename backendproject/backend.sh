#!/bin/bash
echo "Waiting for PostgreSQL..."

attempt=0
max_attempts=30

while [ $attempt -lt $max_attempts ]; do
  if (echo > /dev/tcp/db/5432) >/dev/null 2>&1; then
    echo "Postgres port is reachable - proceeding"
    break
  fi
  attempt=$((attempt + 1))
  echo "Postgres unavailable - sleeping (attempt $attempt/$max_attempts)"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "Timeout waiting for Postgres - exiting"
  exit 1
fi

sleep 3  # extra buffer

echo "Postgres is up - executing command"
echo "Creating Migrations..."
python manage.py makemigrations backendapp
echo =====================================

echo "Starting Migrations"
python manage.py migrate
echo =====================================

echo 'Loading fixture...'
mkdir -p /app/fixtures
python manage.py loaddata fixtures/initial_jobs.json

echo "Starting Server..."
python manage.py runserver 0.0.0.0:8000