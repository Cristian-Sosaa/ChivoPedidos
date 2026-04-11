<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Resetear cache de permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear permisos
        $permisos = [
            // Usuarios
            'usuarios.ver',
            'usuarios.crear',
            'usuarios.editar',
            'usuarios.eliminar',

            // Categorías
            'categorias.ver',
            'categorias.crear',
            'categorias.editar',

            // Productos
            'productos.ver',
            'productos.crear',
            'productos.editar',

            // Clientes
            'clientes.ver',
            'clientes.crear',
            'clientes.editar',

            // Pedidos
            'pedidos.ver',
            'pedidos.crear',
            'pedidos.editar',

            // Pagos
            'pagos.ver',
            'pagos.crear',

            // Reportes
            'reportes.ver',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }

        // Crear rol Admin con TODOS los permisos
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // Crear rol Empleado con permisos limitados
        $empleado = Role::firstOrCreate(['name' => 'empleado']);
        $empleado->givePermissionTo([
            'categorias.ver',
            'productos.ver',
            'clientes.ver',
            'clientes.crear',
            'clientes.editar',
            'pedidos.ver',
            'pedidos.crear',
            'pedidos.editar',
            'pagos.ver',
            'pagos.crear',
        ]);

        // Crear usuario administrador por defecto
        $userAdmin = User::firstOrCreate(
            ['email' => 'admin@chivopedidos.com'],
            [
                'name' => 'Administrador',
                'password' => bcrypt('password'),
            ]
        );
        $userAdmin->assignRole('admin');

        // Crear usuario empleado de prueba
        $userEmpleado = User::firstOrCreate(
            ['email' => 'empleado@chivopedidos.com'],
            [
                'name' => 'Empleado Demo',
                'password' => bcrypt('password'),
            ]
        );
        $userEmpleado->assignRole('empleado');
    }
}