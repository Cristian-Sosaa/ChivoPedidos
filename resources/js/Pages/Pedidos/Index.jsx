// resources/js/Pages/Pedidos/Index.jsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import { Plus, Search, Eye } from 'lucide-react';

const estadoVariants = {
    pendiente: 'warning',
    en_proceso: 'default',
    enviado: 'default',
    entregado: 'success',
    cancelado: 'destructive',
};

const estadoLabels = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
};

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-SV', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Index({ pedidos, estados, filters }) {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters?.search || '');

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    function applyFilters(newFilters) {
        router.get('/pedidos', { ...filters, ...newFilters }, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
                        <p className="mt-1 text-sm text-gray-500">Gestión de pedidos del sistema</p>
                    </div>
                    {can('pedidos.crear') && (
                        <Link href="/pedidos-crear">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo pedido
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
                                placeholder="Buscar por # o cliente..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Buscar</Button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filters?.estado_id || ''}
                            onChange={(e) => applyFilters({ estado_id: e.target.value })}
                            className="px-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Todos los estados</option>
                            {estados.map((est) => (
                                <option key={est.id} value={est.id}>
                                    {estadoLabels[est.nombre] || est.nombre}
                                </option>
                            ))}
                        </select>

                        <Input
                            type="date"
                            value={filters?.desde || ''}
                            onChange={(e) => applyFilters({ desde: e.target.value })}
                            className="w-auto"
                            title="Desde"
                        />
                        <Input
                            type="date"
                            value={filters?.hasta || ''}
                            onChange={(e) => applyFilters({ hasta: e.target.value })}
                            className="w-auto"
                            title="Hasta"
                        />
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Pedido #</th>
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Cliente</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 md:table-cell">Fecha</th>
                                    <th className="px-4 py-3 font-medium text-center text-gray-600">Estado</th>
                                    <th className="px-4 py-3 font-medium text-right text-gray-600">Total</th>
                                    <th className="w-20 px-4 py-3 font-medium text-center text-gray-600">Ver</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pedidos.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            No se encontraron pedidos.
                                        </td>
                                    </tr>
                                ) : (
                                    pedidos.data.map((pedido) => (
                                        <tr key={pedido.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-gray-900">
                                                    #{String(pedido.id).padStart(4, '0')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{pedido.cliente?.nombre}</p>
                                                    <p className="text-xs text-gray-400 md:hidden">
                                                        {formatDate(pedido.created_at)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                                                {formatDate(pedido.created_at)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant={estadoVariants[pedido.estado?.nombre] || 'secondary'}>
                                                    {estadoLabels[pedido.estado?.nombre] || pedido.estado?.nombre}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-right text-gray-900">
                                                {formatPrice(pedido.total)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link href={`/pedidos/${pedido.id}`}>
                                                    <Button variant="ghost" size="icon" title="Ver detalle">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 pb-4">
                        <Pagination
                            links={pedidos.links}
                            meta={{ from: pedidos.from, to: pedidos.to, total: pedidos.total }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}