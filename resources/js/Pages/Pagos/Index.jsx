// resources/js/Pages/Pagos/Index.jsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import { Plus, Search, Ban } from 'lucide-react';

const metodoLabels = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    cheque: 'Cheque',
    otro: 'Otro',
};

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-SV', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function Index({ pagos, filters }) {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters?.search || '');
    const [confirmAnular, setConfirmAnular] = useState(null);

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    function applyFilters(newFilters) {
        router.get('/pagos', { ...filters, ...newFilters }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleAnular() {
        if (!confirmAnular) return;
        router.patch(`/pagos/${confirmAnular.id}/anular`, {}, {
            preserveScroll: true,
            onFinish: () => setConfirmAnular(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
                        <p className="mt-1 text-sm text-gray-500">Registro de pagos del sistema</p>
                    </div>
                    {can('pagos.crear') && (
                        <Link href="/pagos/crear">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Registrar pago
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
                                placeholder="Buscar por referencia, # pedido, cliente..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Buscar</Button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filters?.metodo_pago || ''}
                            onChange={(e) => applyFilters({ metodo_pago: e.target.value })}
                            className="px-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Todos los métodos</option>
                            {Object.entries(metodoLabels).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>

                        <select
                            value={filters?.estado || ''}
                            onChange={(e) => applyFilters({ estado: e.target.value })}
                            className="px-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Todos los estados</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="anulado">Anulado</option>
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
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Fecha</th>
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Pedido</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 md:table-cell">Cliente</th>
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Método</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 lg:table-cell">Referencia</th>
                                    <th className="px-4 py-3 font-medium text-right text-gray-600">Monto</th>
                                    <th className="px-4 py-3 font-medium text-center text-gray-600">Estado</th>
                                    {can('pagos.crear') && (
                                        <th className="w-20 px-4 py-3 font-medium text-center text-gray-600">Acc.</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pagos.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                                            No se encontraron pagos.
                                        </td>
                                    </tr>
                                ) : (
                                    pagos.data.map((pago) => (
                                        <tr key={pago.id} className={`hover:bg-gray-50 transition-colors ${pago.estado === 'anulado' ? 'opacity-50' : ''}`}>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                {formatDate(pago.created_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/pedidos/${pago.pedido_id}`}
                                                    className="font-mono "
                                                >
                                                    #{String(pago.pedido_id).padStart(4, '0')}
                                                </Link>
                                            </td>
                                            <td className="hidden px-4 py-3 text-gray-700 md:table-cell">
                                                {pago.pedido?.cliente?.nombre}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 capitalize">
                                                {metodoLabels[pago.metodo_pago] || pago.metodo_pago}
                                            </td>
                                            <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                                                {pago.referencia || '—'}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-right text-gray-900">
                                                {formatPrice(pago.monto)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant={pago.estado === 'confirmado' ? 'success' : 'destructive'}>
                                                    {pago.estado === 'confirmado' ? 'Confirmado' : 'Anulado'}
                                                </Badge>
                                            </td>
                                            {can('pagos.crear') && (
                                                <td className="px-4 py-3 text-center">
                                                    {pago.estado === 'confirmado' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 h-7 w-7 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => setConfirmAnular(pago)}
                                                            title="Anular pago"
                                                        >
                                                            <Ban className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
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
                            links={pagos.links}
                            meta={{ from: pagos.from, to: pagos.to, total: pagos.total }}
                        />
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!confirmAnular}
                title="Anular pago"
                message={`¿Estás seguro de anular el pago de ${formatPrice(confirmAnular?.monto)} del pedido #${String(confirmAnular?.pedido_id).padStart(4, '0')}? Esta acción no se puede deshacer.`}
                confirmText="Anular pago"
                variant="destructive"
                onConfirm={handleAnular}
                onCancel={() => setConfirmAnular(null)}
            />
        </AuthenticatedLayout>
    );
}