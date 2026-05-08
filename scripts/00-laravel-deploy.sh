#!/usr/bin/env bash

echo "🚀 Running composer..."
composer install --no-dev --working-dir=/var/www/html

echo "🔑 Generating application key..."
php artisan key:generate --show

echo "📦 Caching config..."
php artisan config:cache

echo "🛤️ Caching routes..."
php artisan route:cache

echo "🗃️ Running migrations..."
php artisan migrate --force

echo "🌱 Running seeders..."
php artisan db:seed --force

echo "🔗 Creating storage link..."
php artisan storage:link

echo "🏗️ Building frontend assets..."
npm install
npm run build

echo "✅ Deployment complete!"