// resources/js/Pages/Historial/Index.jsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Search, History, ArrowRight, Filter, X } from 'lucide-react';

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

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-SV', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Index({ historial, estados, usuarios, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [showFilters, setShowFilters] = useState(
        !!(filters?.estado_id || filters?.user_id || filters?.desde || filters?.hasta)
    );

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    function applyFilters(newFilters) {
        router.get('/historial', { ...filters, ...newFilters }, {
            preserveState: true,
            replace: true,
        });
    }

    function clearFilters() {
        router.get('/historial', {}, { preserveState: true, replace: true });
        setSearch('');
    }

    const hasActiveFilters = filters?.search || filters?.estado_id || filters?.user_id || filters?.desde || filters?.hasta;

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Historial de pedidos</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Registro de todos los cambios de estado en los pedidos
                    </p>
                </div>

                {/* Búsqueda y toggle filtros */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <Input
                                type="text"
                                placeholder="Buscar por # pedido, cliente, comentario..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Buscar</Button>
                    </form>

                    <div className="flex gap-2">
                        <Button
                            variant={showFilters ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-1"
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Filtros
                        </Button>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-gray-500">
                                <X className="w-3.5 h-3.5" />
                                Limpiar
                            </Button>
                        )}
                    </div>
                </div>

                {/* Panel de filtros */}
                {showFilters && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-500">Estado</label>
                                    <select
                                        value={filters?.estado_id || ''}
                                        onChange={(e) => applyFilters({ estado_id: e.target.value })}
                                        className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Todos los estados</option>
                                        {estados.map((est) => (
                                            <option key={est.id} value={est.id}>
                                                {estadoLabels[est.nombre] || est.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-500">Usuario</label>
                                    <select
                                        value={filters?.user_id || ''}
                                        onChange={(e) => applyFilters({ user_id: e.target.value })}
                                        className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Todos los usuarios</option>
                                        {usuarios.map((u) => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-500">Desde</label>
                                    <Input
                                        type="date"
                                        value={filters?.desde || ''}
                                        onChange={(e) => applyFilters({ desde: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-500">Hasta</label>
                                    <Input
                                        type="date"
                                        value={filters?.hasta || ''}
                                        onChange={(e) => applyFilters({ hasta: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Timeline */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                    {historial.data.length === 0 ? (
                        <div className="px-4 py-12 text-center text-gray-400">
                            <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">No se encontraron registros de historial.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {historial.data.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 transition-colors hover:bg-gray-50">
                                    {/* Indicador visual */}
                                    <div className="flex flex-col items-center pt-1">
                                        <div className={`w-3 h-3 rounded-full shrink-0 ${
                                            item.estado_nuevo?.nombre === 'cancelado'
                                                ? 'bg-red-400'
                                                : item.estado_nuevo?.nombre === 'entregado'
                                                  ? 'bg-green-400'
                                                  : 'bg-indigo-400'
                                        }`} />
                                        <div className="flex-1 w-px mt-1 bg-gray-200" />
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            {/* Pedido */}
                                            <Link
                                                href={`/pedidos/${item.pedido_id}`}
                                                className="font-mono text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                            >
                                                #{String(item.pedido_id).padStart(4, '0')}
                                            </Link>

                                            {/* Transición de estado */}
                                            {item.estado_anterior ? (
                                                <>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {estadoLabels[item.estado_anterior?.nombre] || item.estado_anterior?.nombre}
                                                    </Badge>
                                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400">Creado como</span>
                                            )}
                                            <Badge variant={estadoVariants[item.estado_nuevo?.nombre] || 'secondary'} className="text-xs">
                                                {estadoLabels[item.estado_nuevo?.nombre] || item.estado_nuevo?.nombre}
                                            </Badge>
                                        </div>

                                        {/* Cliente */}
                                        <p className="text-sm text-gray-600">
                                            Cliente: <span className="font-medium">{item.pedido?.cliente?.nombre}</span>
                                        </p>

                                        {/* Comentario */}
                                        {item.comentario && (
                                            <p className="mt-1 text-sm italic text-gray-500">
                                                "{item.comentario}"
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <p className="mt-1 text-xs text-gray-400">
                                            {item.usuario?.name} · {formatDate(item.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="px-4 pb-4">
                        <Pagination
                            links={historial.links}
                            meta={{ from: historial.from, to: historial.to, total: historial.total }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}