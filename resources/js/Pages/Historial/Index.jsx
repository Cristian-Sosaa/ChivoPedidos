// resources/js/Pages/Historial/Index.jsx
import { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Search, History, ArrowRight, Filter, X,
    LayoutList, GitBranch,
} from 'lucide-react';

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

const estadoColors = {
    pendiente: '#f59e0b',
    en_proceso: '#3b82f6',
    enviado: '#6366f1',
    entregado: '#10b981',
    cancelado: '#ef4444',
};

function formatGroupDate(dateString) {
    const date = new Date(dateString);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    if (date.toDateString() === hoy.toDateString()) return 'Hoy';
    if (date.toDateString() === ayer.toDateString()) return 'Ayer';

    return date.toLocaleDateString('es-SV', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('es-SV', {
        hour: '2-digit', minute: '2-digit',
    });
}

function getDateKey(dateString) {
    return new Date(dateString).toDateString();
}

// ─── Vista tabla compacta ───────────────────────────────
function CompactView({ historial }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 font-medium text-left text-gray-600">Hora</th>
                        <th className="px-4 py-3 font-medium text-left text-gray-600">Pedido</th>
                        <th className="hidden px-4 py-3 font-medium text-left text-gray-600 md:table-cell">Cliente</th>
                        <th className="px-4 py-3 font-medium text-center text-gray-600">Cambio de estado</th>
                        <th className="hidden px-4 py-3 font-medium text-left text-gray-600 lg:table-cell">Comentario</th>
                        <th className="hidden px-4 py-3 font-medium text-left text-gray-600 sm:table-cell">Usuario</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {historial.map((item, i) => (
                        <tr
                            key={item.id}
                            className="transition-colors hover:bg-gray-50/80 compact-row"
                            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                        >
                            <td className="px-4 py-2.5 text-xs text-gray-400 font-mono whitespace-nowrap">
                                {formatTime(item.created_at)}
                            </td>
                            <td className="px-4 py-2.5">
                                <Link
                                    href={`/pedidos/${item.pedido_id}`}
                                    className="font-mono text-sm transition-colors "
                                >
                                    #{String(item.pedido_id).padStart(4, '0')}
                                </Link>
                            </td>
                            <td className="px-4 py-2.5 text-gray-600 hidden md:table-cell">
                                {item.pedido?.cliente?.nombre}
                            </td>
                            <td className="px-4 py-2.5">
                                <div className="flex items-center justify-center gap-1.5">
                                    {item.estado_anterior ? (
                                        <>
                                            <Badge variant="secondary" className="text-xs">
                                                {estadoLabels[item.estado_anterior?.nombre] || item.estado_anterior?.nombre}
                                            </Badge>
                                            <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                                        </>
                                    ) : (
                                        <span className="mr-1 text-xs text-gray-400">Nuevo →</span>
                                    )}
                                    <Badge variant={estadoVariants[item.estado_nuevo?.nombre] || 'secondary'} className="text-xs">
                                        {estadoLabels[item.estado_nuevo?.nombre] || item.estado_nuevo?.nombre}
                                    </Badge>
                                </div>
                            </td>
                            <td className="px-4 py-2.5 text-gray-500 text-xs hidden lg:table-cell max-w-48 truncate" title={item.comentario}>
                                {item.comentario || <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-4 py-2.5 hidden sm:table-cell">
                                <div className="flex items-center gap-1.5">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold shrink-0">
                                        {item.usuario?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                    <span className="text-xs text-gray-600">{item.usuario?.name}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Vista timeline agrupada por fecha ──────────────────
function TimelineView({ historial }) {
    const grouped = useMemo(() => {
        const groups = {};
        historial.forEach((item) => {
            const key = getDateKey(item.created_at);
            if (!groups[key]) groups[key] = { date: item.created_at, items: [] };
            groups[key].items.push(item);
        });
        return Object.values(groups);
    }, [historial]);

    return (
        <div className="p-4 space-y-6">
            {grouped.map((group, gi) => (
                <div key={gi} className="timeline-group" style={{ animationDelay: `${gi * 100}ms` }}>
                    {/* Separador de fecha */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                        <span className="px-2 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-white">
                            {formatGroupDate(group.date)}
                        </span>
                        <span className="text-xs text-gray-400">{group.items.length} cambios</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-transparent" />
                    </div>

                    {/* Items del grupo */}
                    <div className="relative ml-4">
                        {/* Línea vertical */}
                        <div className="absolute left-0 w-px top-2 bottom-2 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent timeline-line" />

                        {group.items.map((item, i) => {
                            const estadoNombre = item.estado_nuevo?.nombre || 'pendiente';
                            const color = estadoColors[estadoNombre] || '#94a3b8';

                            return (
                                <div
                                    key={item.id}
                                    className="relative pb-5 pl-7 last:pb-0 timeline-entry group"
                                    style={{ animationDelay: `${gi * 100 + i * 60}ms` }}
                                >
                                    {/* Punto */}
                                    <div className="absolute left-0 top-1.5 -translate-x-1/2">
                                        <div className="relative">
                                            <div
                                                className="absolute -inset-1.5 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                                                style={{ backgroundColor: color }}
                                            />
                                            <div
                                                className="relative w-3 h-3 transition-transform duration-200 border-2 border-white rounded-full shadow-sm group-hover:scale-125"
                                                style={{ backgroundColor: color }}
                                            />
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="rounded-lg border border-transparent p-2.5 transition-all duration-200 group-hover:border-gray-200 group-hover:bg-gray-50/60 group-hover:shadow-sm">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="font-mono text-xs text-gray-400">{formatTime(item.created_at)}</span>
                                            <Link
                                                href={`/pedidos/${item.pedido_id}`}
                                                className="font-mono text-sm transition-colors"
                                            >
                                                #{String(item.pedido_id).padStart(4, '0')}
                                            </Link>
                                            <div className="flex items-center gap-1.5">
                                                {item.estado_anterior ? (
                                                    <>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {estadoLabels[item.estado_anterior?.nombre] || item.estado_anterior?.nombre}
                                                        </Badge>
                                                        <ArrowRight className="w-3 h-3 text-gray-400" />
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Nuevo →</span>
                                                )}
                                                <Badge variant={estadoVariants[estadoNombre] || 'secondary'} className="text-xs">
                                                    {estadoLabels[estadoNombre] || estadoNombre}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-gray-600">· {item.pedido?.cliente?.nombre}</span>
                                        </div>

                                        {item.comentario && (
                                            <p className="mt-1.5 text-sm text-gray-500 italic border-l-2 border-gray-200 pl-2 ml-0.5">
                                                {item.comentario}
                                            </p>
                                        )}

                                        <div className="mt-1.5 flex items-center gap-1.5">
                                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-[8px] font-bold text-gray-500 shrink-0">
                                                {item.usuario?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                            <span className="text-xs text-gray-400">{item.usuario?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Página principal ───────────────────────────────────
export default function Index({ historial, estados, usuarios, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [viewMode, setViewMode] = useState('compact');
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

    // Resumen por estado de la página actual
    const resumenEstados = useMemo(() => {
        const counts = {};
        historial.data.forEach((item) => {
            const nombre = item.estado_nuevo?.nombre;
            if (nombre) counts[nombre] = (counts[nombre] || 0) + 1;
        });
        return counts;
    }, [historial.data]);

    return (
        <AuthenticatedLayout>
            <style>{`
                @keyframes fade-slide-up {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes grow-line {
                    from { transform: scaleY(0); }
                    to   { transform: scaleY(1); }
                }
                .compact-row { animation: fade-slide-up 0.3s ease-out both; }
                .timeline-group { animation: fade-slide-up 0.4s ease-out both; }
                .timeline-entry { animation: fade-slide-up 0.35s ease-out both; }
                .timeline-line { transform-origin: top; animation: grow-line 0.6s ease-out both; }
            `}</style>

            <div className="space-y-6">
                {/* Header con toggle de vista */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Historial de pedidos</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {historial.total} registro{historial.total !== 1 ? 's' : ''} de cambios de estado
                        </p>
                    </div>

                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button
                            onClick={() => setViewMode('compact')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                viewMode === 'compact'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <LayoutList className="w-3.5 h-3.5" />
                            Tabla
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                viewMode === 'timeline'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <GitBranch className="w-3.5 h-3.5" />
                            Timeline
                        </button>
                    </div>
                </div>

          

                {/* Búsqueda y filtros */}
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

                {/* Panel de filtros avanzados */}
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

                {/* Contenido principal */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                    {historial.data.length === 0 ? (
                        <div className="px-4 py-12 text-center text-gray-400">
                            <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">No se encontraron registros de historial.</p>
                        </div>
                    ) : viewMode === 'compact' ? (
                        <CompactView historial={historial.data} />
                    ) : (
                        <TimelineView historial={historial.data} />
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