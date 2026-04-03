# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Chivo Pedidos** — a Laravel 11 order management system for tracking products, clients, orders, payments, and reports. UI is built with React 19 via Inertia.js (no separate frontend server — Laravel serves the SPA).

## Commands

### Development
```bash
composer run dev        # starts Laravel server, queue worker, log watcher, and Vite in parallel
```

Or run individually:
```bash
php artisan serve       # Laravel dev server
npm run dev             # Vite (HMR for React/CSS)
```

### Build
```bash
npm run build           # production Vite build
```

### Testing
```bash
php artisan test                        # run all tests
php artisan test --filter=TestName      # run a single test
./vendor/bin/phpunit tests/path/Test.php  # run a specific file
```

### Code Style
```bash
./vendor/bin/pint       # Laravel Pint (PHP formatter)
```

### Database
```bash
php artisan migrate
php artisan migrate:fresh --seed
php artisan tinker
```

## Architecture

### Full-Stack Pattern: Laravel + Inertia.js + React
- Laravel handles routing, controllers, and data — no REST API layer
- Inertia bridges server and client: controllers return `Inertia::render('PageName', $props)` instead of JSON or Blade views
- React pages receive props directly from Laravel controllers; no separate API calls needed
- Ziggy provides named Laravel routes to the frontend via the `route()` helper in JS

### Frontend Structure (`resources/js/`)
- `Pages/` — Inertia page components (one per route); resolved automatically by name in `app.jsx`
- `Layouts/AuthenticatedLayout.jsx` — main shell with sidebar nav and topbar; wraps all authenticated pages
- `Components/ui/` — shadcn-style primitives (Button, Card, Input, Label, Badge) using `cn()` from `lib/utils.js`
- `lib/utils.js` — exports `cn()` (clsx + tailwind-merge) for conditional class merging

### Backend Structure (`app/`)
- `Http/Controllers/` — standard Laravel controllers; currently only the base `Controller.php`
- `Models/` — Eloquent models; currently only `User.php`
- Database: **PostgreSQL** (Neon) as the default connection (`DB_CONNECTION=pgsql`)

### Navigation
The sidebar in `AuthenticatedLayout.jsx` defines the full intended feature set:
Dashboard → Categorías → Productos → Clientes → Pedidos → Pagos → Reportes → Configuración

Most routes beyond `/dashboard` are not yet implemented.

### Styling
- Tailwind CSS v3 with PostCSS
- `@` alias resolves to `resources/js/`
