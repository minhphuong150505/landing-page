#!/usr/bin/env bash
set -euo pipefail

ZONE=us-central1-a
VM=landing-vm
PROJECT=deploy-app-web-494904

echo "[1/4] Syncing source to VM (excluding node_modules, target, .git)..."
gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command='mkdir -p ~/app'

# Use rsync via gcloud ssh tunnel to avoid copying build artifacts
gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT -- \
  "mkdir -p ~/app/backend ~/app/frontend"

# Copy each directory with excludes via tar pipe
tar --exclude='./backend/target' \
    --exclude='./frontend/node_modules' \
    --exclude='./frontend/dist' \
    --exclude='./.git' \
    -czf /tmp/app-src.tar.gz \
    -C /home/phuong/Documents/test/landing-page \
    ./backend ./frontend ./Caddyfile ./docker-compose.prod.yml

echo "  → Uploading archive and .env.prod..."
gcloud compute scp --zone=$ZONE --project=$PROJECT \
  /tmp/app-src.tar.gz $VM:~/app-src.tar.gz
gcloud compute scp --zone=$ZONE --project=$PROJECT \
  /home/phuong/Documents/test/landing-page/.env.prod $VM:~/app/.env.prod

echo "  → Extracting on VM..."
gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command='
  tar -xzf ~/app-src.tar.gz -C ~/app --strip-components=1 && rm ~/app-src.tar.gz
'
rm -f /tmp/app-src.tar.gz

echo "[2/4] Stopping old containers..."
gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command='
  cd ~/app && docker compose -f docker-compose.prod.yml down 2>/dev/null || true
'

echo "[3/4] Building and starting containers..."
gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command='
  cd ~/app
  docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
'

echo "[4/4] Container status:"
gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
echo ""
echo "Done! App URL: https://$(grep DOMAIN ~/Documents/test/landing-page/.env.prod | cut -d= -f2)"
