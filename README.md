<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Sanctum-API-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
</p>

<h1 align="center">Chivo Pedidos</h1>
<p align="center">Sistema de gestión de pedidos con API REST</p>

<p align="center">
  <img src="https://img.shields.io/badge/Endpoints-37-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Roles-2-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Permisos-17-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Módulos-9-purple?style=flat-square" />
</p>

---

## Acerca del proyecto

Sistema web para administrar productos, clientes, pedidos, pagos e inventario. Incluye dashboard con gráficos, control de roles/permisos, y una API REST completa con 37 endpoints protegidos con Laravel Sanctum.

## Tech Stack

**Backend**

![Laravel](https://img.shields.io/badge/Laravel_11-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP_8.2+-777BB4?style=flat-square&logo=php&logoColor=white)
![Sanctum](https://img.shields.io/badge/Sanctum-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![Spatie](https://img.shields.io/badge/Spatie_Permission-197BC1?style=flat-square&logo=laravel&logoColor=white)

**Frontend**

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Inertia](https://img.shields.io/badge/Inertia.js-9553E9?style=flat-square&logo=inertia&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=recharts&logoColor=white)

**Base de datos e infraestructura**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-000000?style=flat-square&logo=neon&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

## Módulos

| Módulo | Descripción |
|--------|-------------|
| Dashboard | Métricas, gráficos de ventas, top productos, top clientes, alertas de stock |
| Categorías | CRUD completo con activar/desactivar |
| Productos | CRUD con control de stock y relación con categorías |
| Clientes | CRUD con búsqueda por nombre, email, teléfono, dirección |
| Pedidos | Detalle dinámico, cálculo automático de totales, cambio de estados |
| Pagos | 5 métodos de pago, control de saldo pendiente, anulación |
| Historial | Auditoría de cambios con vista tabla y timeline |
| Inventario | Alertas de stock bajo, ajustes de entrada/salida |
| API REST | 37 endpoints con autenticación por tokens |

## Roles y permisos

| | Admin | Empleado |
|--|:-----:|:--------:|
| Usuarios | Completo | - |
| Categorías | Completo | Solo ver |
| Productos | Completo | Solo ver |
| Clientes | Completo | Completo |
| Pedidos | Completo | Completo |
| Pagos | Completo | Completo |
| Reportes | Completo | - |
| Inventario | Completo | Solo ver |

## Instalación

```bash
git clone https://github.com/tu-usuario/chivo-pedidos.git
cd chivo-pedidos
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Configurar `.env` con los datos de PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=tu-host.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-contraseña
DB_SSLMODE=require
```

Ejecutar migraciones, seeders y compilar:

```bash
php artisan migrate
php artisan db:seed
npm run build
php artisan serve
```

## Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | `admin@chivopedidos.com` | `password` |
| Empleado | `empleado@chivopedidos.com` | `password` |

## API REST

Autenticación con tokens Bearer (Laravel Sanctum).

**Login:**
```http
POST /api/login
Content-Type: application/json

{ "email": "admin@chivopedidos.com", "password": "password" }
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso.",
  "data": {
    "user": { "id": 1, "name": "Administrador", "roles": ["admin"] },
    "token": "1|abc123..."
  }
}
```

**Usar el token en cada petición:**
```http
Authorization: Bearer {token}
```

### Endpoints

<details>
<summary><strong>Auth (3)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/login` | Iniciar sesión |
| `POST` | `/api/logout` | Cerrar sesión |
| `GET` | `/api/me` | Usuario autenticado |

</details>

<details>
<summary><strong>Dashboard (1)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Métricas completas del sistema |

</details>

<details>
<summary><strong>Categorías (6)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/categorias` | Listar con búsqueda y filtros |
| `GET` | `/api/categorias/all` | Todas las activas |
| `POST` | `/api/categorias` | Crear |
| `GET` | `/api/categorias/{id}` | Ver una |
| `PUT` | `/api/categorias/{id}` | Editar |
| `PATCH` | `/api/categorias/{id}/toggle` | Activar/desactivar |

</details>

<details>
<summary><strong>Productos (5)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/productos` | Listar con filtros |
| `POST` | `/api/productos` | Crear |
| `GET` | `/api/productos/{id}` | Ver uno |
| `PUT` | `/api/productos/{id}` | Editar |
| `PATCH` | `/api/productos/{id}/toggle` | Activar/desactivar |

</details>

<details>
<summary><strong>Clientes (6)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/clientes` | Listar con búsqueda |
| `GET` | `/api/clientes/all` | Todos los activos |
| `POST` | `/api/clientes` | Crear |
| `GET` | `/api/clientes/{id}` | Ver uno |
| `PUT` | `/api/clientes/{id}` | Editar |
| `PATCH` | `/api/clientes/{id}/toggle` | Activar/desactivar |

</details>

<details>
<summary><strong>Pedidos (8)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pedidos` | Listar con filtros |
| `POST` | `/api/pedidos` | Crear con detalle |
| `GET` | `/api/pedidos/{id}` | Ver detalle completo |
| `GET` | `/api/pedidos/estados` | Estados disponibles |
| `PATCH` | `/api/pedidos/{id}/estado` | Cambiar estado |
| `POST` | `/api/pedidos/{id}/detalle` | Agregar producto |
| `PATCH` | `/api/pedidos/{id}/detalle/{det}/cantidad` | Cambiar cantidad |
| `DELETE` | `/api/pedidos/{id}/detalle/{det}` | Eliminar producto |

</details>

<details>
<summary><strong>Pagos (4)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pagos` | Listar con filtros |
| `POST` | `/api/pagos` | Registrar pago |
| `PATCH` | `/api/pagos/{id}/anular` | Anular pago |
| `GET` | `/api/pagos/pedidos-con-saldo` | Pedidos con saldo |

</details>

<details>
<summary><strong>Historial (1)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/historial` | Cambios de estado |

</details>

<details>
<summary><strong>Inventario (2)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/inventario` | Inventario con resumen |
| `PATCH` | `/api/inventario/{id}/ajustar` | Ajustar stock |

</details>

<details>
<summary><strong>Usuarios (1)</strong></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios` | Listar usuarios |

</details>

## Arquitectura

```
app/
├── Http/Controllers/          Controladores web (Inertia)
├── Http/Controllers/Api/      Controlador API (JSON)
├── Http/Requests/             Validaciones compartidas
├── Models/                    Modelos Eloquent
├── Services/                  Lógica de negocio
resources/js/
├── Pages/                     Páginas React
├── Layouts/                   Sidebar, topbar
├── Components/                Componentes reutilizables
routes/
├── web.php                    Rutas web
├── api.php                    Rutas API
```

La interfaz web usa Inertia.js y la API REST funciona de forma independiente. Ambas capas comparten los mismos modelos, servicios y validaciones.

## Documentación

La documentación interactiva de la API está disponible en `/docs`.

## Licencia

Este proyecto está bajo la [MIT License](LICENSE).