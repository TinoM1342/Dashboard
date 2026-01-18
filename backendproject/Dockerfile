

FROM python:3.7.3-stretch

# Set unbuffered output for python
ENV PYTHONUNBUFFERED 1

# Create app directory
WORKDIR /app

# Install app dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Bundle app source
COPY . .

# Make sure the startup script is executable
RUN chmod +x /app/backend.sh

# Expose port
EXPOSE 8000

# entrypoint to run the backend.sh file
ENTRYPOINT ["/app/backend.sh"]


