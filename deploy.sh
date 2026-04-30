#!/usr/bin/env bash
set -euo pipefail

ZONE=us-central1-a
VM=landing-vm

echo "[1/3] Syncing source to VM..."
gcloud compute ssh $VM --zone=$ZONE --command='mkdir -p ~/app'
gcloud compute scp --zone=$ZONE --recurse \
  backend frontend Caddyfile docker-compose.prod.yml .env.prod \
  $VM:~/app/

echo "[2/3] Building and restarting containers..."
gcloud compute ssh $VM --zone=$ZONE --command='
  cd ~/app
  docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
'

echo "[3/3] Container status:"
gcloud compute ssh $VM --zone=$ZONE --command='docker ps'
