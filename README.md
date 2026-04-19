<div align="center">

# Chivo Pedidos

**Sistema de gestión de pedidos para pequeños negocios**

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[Reportar Bug](https://github.com/Cristian-Sosaa/ChivoPedidos/issues) · [Solicitar Feature](https://github.com/Cristian-Sosaa/ChivoPedidos/issues)

</div>

---

## Tabla de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración del Entorno](#configuración-del-entorno)
- [Base de Datos](#base-de-datos)
- [Usuarios por Defecto](#usuarios-por-defecto)
- [Comandos Disponibles](#comandos-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Roles y Permisos](#roles-y-permisos)
---

## Sobre el Proyecto

**Chivo Pedidos** es una aplicación web monolítica para gestionar productos, clientes, pedidos, pagos y reportes de pequeños negocios. Construida con Laravel 11 e Inertia.js, entrega una experiencia de SPA sin necesidad de un servidor de frontend separado — Laravel sirve directamente los componentes React.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Laravel 11, PHP 8.2+ |
| Frontend | React 19, Inertia.js 2.0 |
| Estilos | Tailwind CSS 3.4 |
| Build tool | Vite 6 |
| Base de datos | PostgreSQL (Neon) |
| Autenticación | Laravel Session + Spatie Permission |
| Íconos | Lucide React |
| Rutas JS | Ziggy 2.6 |
| Testing | PHPUnit 11 |
| Formato PHP | Laravel Pint |

---

## Características

- Autenticación con email y contraseña
- Sistema de roles y permisos granulares (Spatie Laravel-Permission)
- Dashboard con métricas del negocio
- Sidebar responsivo con navegación por permisos
- Componentes UI reutilizables (Button, Card, Badge, Input, Label)
- Hook `usePermissions()` para control de acceso en el frontend

**Módulos planificados:** Categorías · Productos · Clientes · Pedidos · Pagos · Reportes · Configuración

---

## Requisitos Previos

| Herramienta | Versión mínima | Verificar |
|-------------|---------------|-----------|
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | Cualquiera | `git -v` |
| Cuenta en Neon | — | [neon.tech](https://neon.tech) |

---

## Instalación

> React, Inertia.js, Tailwind, Spatie y el resto de librerías **no se instalan por separado** — todo entra automáticamente con `composer install` y `npm install`.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Cristian-Sosaa/ChivoPedidos.git
cd ChivoPedidos
```

### 2. Instalar dependencias PHP

```bash
composer install
```

Instala automáticamente: Laravel 11, Inertia para Laravel, Spatie Permission, Ziggy, Pint, PHPUnit y más.

### 3. Instalar dependencias JavaScript

```bash
npm install
```

Instala automáticamente: React 19, Inertia React, Tailwind CSS, Lucide React, Vite y más.

### 4. Copiar el archivo de entorno

```bash
cp .env.example .env
```

### 5. Generar la clave de la aplicación

```bash
php artisan key:generate
```

### 6. Publicar la configuración de Spatie

```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

### 7. Configurar Neon en el `.env`

Ver sección [Configuración del Entorno](#configuración-del-entorno).

### 8. Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```

### 9. Iniciar el servidor de desarrollo

```bash
composer run dev
```

Abre [http://localhost:8000](http://localhost:8000) en tu navegador.

---

## Configuración del Entorno

### Aplicación

```env
APP_NAME="Chivo Pedidos"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
```

### Base de datos — Neon (PostgreSQL)

Este proyecto usa [Neon](https://neon.tech) como base de datos PostgreSQL en la nube. Para configurarlo:

1. Crea una cuenta gratuita en [neon.tech](https://neon.tech).
2. Crea un nuevo proyecto — Neon genera la base de datos automáticamente.
3. En el dashboard de Neon, ve a **Connection Details** y copia los valores.
4. Pega los valores en tu `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=<tu-host>.neon.tech
DB_PORT=5432
DB_DATABASE=<nombre-de-tu-db>
DB_USERNAME=<tu-usuario>
DB_PASSWORD=<tu-contraseña>
NEON_ENDPOINT=<tu-endpoint>
```

> El valor de `NEON_ENDPOINT` es el ID del endpoint que aparece en la URL de conexión de Neon (ejemplo: `ep-dry-star-a0ire27`). Es necesario para que Laravel use el pooler de conexiones correctamente.

### Sesiones, caché y cola

```env
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

---

## Base de Datos

### Migraciones

| Tabla | Descripción |
|-------|-------------|
| `users` | Cuentas de usuario |
| `cache` | Almacenamiento de caché |
| `jobs` | Cola de trabajos |
| `roles` | Roles (Spatie) |
| `permissions` | Permisos (Spatie) |
| `model_has_roles` | Relación usuario-rol |
| `model_has_permissions` | Relación usuario-permiso |
| `role_has_permissions` | Relación rol-permiso |

### Comandos útiles

```bash
php artisan migrate              # Ejecutar migraciones pendientes
php artisan migrate:fresh --seed # Reiniciar y resembrar la BD
php artisan db:seed              # Solo ejecutar seeders
php artisan tinker               # Consola interactiva
```

---

## Usuarios por Defecto

Después de ejecutar `php artisan migrate --seed`:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | `admin@chivopedidos.com` | `password` |
| Empleado | `empleado@chivopedidos.com` | `password` |

> **Importante:** Cambia las contraseñas antes de desplegar en producción.

---

## Comandos Disponibles

```bash
# Desarrollo
composer run dev                          # Servidor + queue + logs + Vite en paralelo
php artisan serve                         # Solo el servidor Laravel
npm run dev                               # Solo Vite con HMR
npm run build                             # Build de producción

# Testing
php artisan test                          # Todos los tests
php artisan test --filter=NombreTest      # Test específico

# Utilidades
./vendor/bin/pint                         # Formatear código PHP
php artisan route:list                    # Listar rutas
php artisan cache:clear                   # Limpiar caché
php artisan config:clear                  # Limpiar caché de configuración
```

---

## Estructura del Proyecto

```
chivopedidos/
├── app/
│   ├── Database/                 # Conector personalizado para Neon
│   ├── Http/
│   │   ├── Controllers/Auth/     # Login y logout
│   │   └── Middleware/           # CheckPermission, HandleInertiaRequests
│   └── Models/User.php           # Usuario con roles y permisos
├── database/
│   ├── migrations/
│   └── seeders/                  # RolesAndPermissionsSeeder
├── resources/js/
│   ├── Pages/
│   │   ├── Dashboard.jsx
│   │   └── Auth/Login.jsx
│   ├── Layouts/
│   │   ├── AuthenticatedLayout.jsx
│   │   └── GuestLayout.jsx
│   ├── Components/ui/            # Button, Card, Input, Label, Badge
│   ├── hooks/usePermissions.js
│   └── lib/utils.js              # cn() helper
├── routes/web.php
├── .env.example
├── composer.json
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Roles y Permisos

El sistema usa [Spatie Laravel-Permission](https://spatie.be/docs/laravel-permission).

### Roles

| Rol | Descripción |
|-----|-------------|
| `admin` | Acceso completo |
| `empleado` | Acceso limitado |

### Permisos

| Módulo | Permisos |
|--------|----------|
| Usuarios | `usuarios.ver` · `usuarios.crear` · `usuarios.editar` · `usuarios.eliminar` |
| Categorías | `categorias.ver` · `categorias.crear` · `categorias.editar` |
| Productos | `productos.ver` · `productos.crear` · `productos.editar` |
| Clientes | `clientes.ver` · `clientes.crear` · `clientes.editar` |
| Pedidos | `pedidos.ver` · `pedidos.crear` · `pedidos.editar` |
| Pagos | `pagos.ver` · `pagos.crear` |
| Reportes | `reportes.ver` |


</div>
