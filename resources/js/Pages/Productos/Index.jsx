// resources/js/Pages/Productos/Index.jsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import {
    Plus,
    Search,
    Pencil,
    ToggleLeft,
    ToggleRight,
    AlertTriangle,
} from 'lucide-react';

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

export default function Index({ productos, categorias, filters }) {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters?.search || '');
    const [confirmToggle, setConfirmToggle] = useState(null);

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    function applyFilters(newFilters) {
        router.get('/productos', { ...filters, ...newFilters }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleToggle() {
        if (!confirmToggle) return;
        router.patch(`/productos/${confirmToggle.id}/toggle`, {}, {
            preserveScroll: true,
            onFinish: () => setConfirmToggle(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                        <p className="mt-1 text-sm text-gray-500">Gestión de productos e inventario</p>
                    </div>
                    {can('productos.crear') && (
                        <Link href="/productos/crear">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo producto
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <Input
                                type="text"
                                placeholder="Buscar producto..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Buscar</Button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {/* Filtro por categoría */}
                        <select
                            value={filters?.categoria_id || ''}
                            onChange={(e) => applyFilters({ categoria_id: e.target.value })}
                            className="px-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>

                        {/* Filtro por estado */}
                        <select
                            value={filters?.activo ?? ''}
                            onChange={(e) => applyFilters({ activo: e.target.value })}
                            className="px-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Todos los estados</option>
                            <option value="1">Activos</option>
                            <option value="0">Inactivos</option>
                        </select>

                        {/* Filtro stock bajo */}
                        <Button
                            variant={filters?.bajo_stock ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => applyFilters({ bajo_stock: filters?.bajo_stock ? '' : '1' })}
                            className="gap-1"
                        >
                            Stock bajo
                        </Button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Producto</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 md:table-cell">Categoría</th>
                                    <th className="px-4 py-3 font-medium text-right text-gray-600">Precio</th>
                                    <th className="px-4 py-3 font-medium text-center text-gray-600">Stock</th>
                                    <th className="px-4 py-3 font-medium text-center text-gray-600">Estado</th>
                                    {can('productos.editar') && (
                                        <th className="w-32 px-4 py-3 font-medium text-center text-gray-600">Acciones</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productos.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            No se encontraron productos.
                                        </td>
                                    </tr>
                                ) : (
                                    productos.data.map((producto) => (
                                        <tr key={producto.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                                                    {producto.descripcion && (
                                                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                                                            {producto.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                                                {producto.categoria?.nombre || (
                                                    <span className="text-gray-300">Sin categoría</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-right text-gray-900">
                                                {formatPrice(producto.precio)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 font-medium ${
                                                        producto.stock <= 10
                                                            ? ''
                                                            : producto.stock <= 25
                                                              ? ''
                                                              : 'text-gray-700'
                                                    }`}
                                                >
                                                    {producto.stock}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant={producto.activo ? 'success' : 'secondary'}>
                                                    {producto.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </td>
                                            {can('productos.editar') && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link href={`/productos/${producto.id}/editar`}>
                                                            <Button variant="ghost" size="icon" title="Editar">
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={producto.activo ? 'Desactivar' : 'Activar'}
                                                            onClick={() => setConfirmToggle(producto)}
                                                        >
                                                            {producto.activo ? (
                                                                <ToggleRight className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 pb-4">
                        <Pagination
                            links={productos.links}
                            meta={{
                                from: productos.from,
                                to: productos.to,
                                total: productos.total,
                            }}
                        />
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!confirmToggle}
                title={confirmToggle?.activo ? 'Desactivar producto' : 'Activar producto'}
                message={
                    confirmToggle?.activo
                        ? `¿Estás seguro de desactivar el producto "${confirmToggle?.nombre}"? No aparecerá al crear pedidos.`
                        : `¿Deseas reactivar el producto "${confirmToggle?.nombre}"?`
                }
                confirmText={confirmToggle?.activo ? 'Desactivar' : 'Activar'}
                variant={confirmToggle?.activo ? 'destructive' : 'default'}
                onConfirm={handleToggle}
                onCancel={() => setConfirmToggle(null)}
            />
        </AuthenticatedLayout>
    );
}