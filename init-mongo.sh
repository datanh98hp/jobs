#!/bin/bash

# Initialize MongoDB database with user authentication
# This script runs when MongoDB container starts for the first time

set -e

# Wait for MongoDB to be ready
until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "Waiting for MongoDB to be ready..."
  sleep 2
done

echo "MongoDB is ready!"

# Create the application database and user
mongosh <<EOF
use ${MONGO_DB_NAME:-job_db}

// Create application-specific user if not root admin
db.createUser({
  user: "${MONGO_DB_USER:-job_user}",
  pwd: "${MONGO_DB_PASSWORD:-job_password}",
  roles: [
    { role: "readWrite", db: "${MONGO_DB_NAME:-job_db}" }
  ]
})

echo "Database and user initialization completed!"
EOF

# Create test database
mongosh <<EOF
use job_test_db
db.createUser({
  user: "${MONGO_DB_USER:-job_user}",
  pwd: "${MONGO_DB_PASSWORD:-job_password}",
  roles: [
    { role: "readWrite", db: "job_test_db" }
  ]
})

echo "Test database initialized!"
EOF
