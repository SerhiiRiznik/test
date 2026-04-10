#!/bin/bash

echo "Starting Presidio Analyzer..."
docker run -d -p 3001:3000 mcr.microsoft.com/presidio-analyzer:latest

echo "Starting Presidio Anonymizer..."
docker run -d -p 3002:3000 mcr.microsoft.com/presidio-anonymizer:latest

echo "Starting NestJS Server..."
node dist/main
