// resources/js/Pages/Pedidos/Show.jsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import {
    ArrowLeft,
    User,
    CalendarDays,
    Package,
    CreditCard,
    Clock,
    Send,
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

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-SV', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function formatShortDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-SV', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

export default function Show({ pedido, estados, totalPagado, saldoPendiente }) {
    const { can } = usePermissions();
    const [nuevoEstadoId, setNuevoEstadoId] = useState('');
    const [comentario, setComentario] = useState('');
    const [processing, setProcessing] = useState(false);

    const esCancelado = pedido.estado?.nombre === 'cancelado';
    const esEntregado = pedido.estado?.nombre === 'entregado';

    function handleCambiarEstado(e) {
        e.preventDefault();
        if (!nuevoEstadoId) return;

        setProcessing(true);
        router.patch(`/pedidos/${pedido.id}/estado`, {
            estado_id: nuevoEstadoId,
            comentario: comentario || null,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setNuevoEstadoId('');
                setComentario('');
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/pedidos">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Pedido #{String(pedido.id).padStart(4, '0')}
                                </h1>
                                <Badge variant={estadoVariants[pedido.estado?.nombre] || 'secondary'}>
                                    {estadoLabels[pedido.estado?.nombre] || pedido.estado?.nombre}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Creado el {formatDate(pedido.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info general */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Cliente</p>
                                <p className="font-semibold text-gray-900">{pedido.cliente?.nombre}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                                <CreditCard className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total / Pagado</p>
                                <p className="font-semibold text-gray-900">
                                    {formatPrice(pedido.total)}
                                    <span className="ml-1 text-xs font-normal text-gray-400">
                                        / {formatPrice(totalPagado)}
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
                                <CalendarDays className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Saldo pendiente</p>
                                <p className={`font-semibold ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatPrice(saldoPendiente)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Observaciones */}
                {pedido.observaciones && (
                    <Card>
                        <CardContent className="p-4">
                            <p className="mb-1 text-xs text-gray-500">Observaciones</p>
                            <p className="text-sm text-gray-700">{pedido.observaciones}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Detalle de productos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Package className="w-4 h-4" />
                            Productos ({pedido.detalles?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-2 font-medium text-left text-gray-600">Producto</th>
                                        <th className="py-2 font-medium text-center text-gray-600">Cantidad</th>
                                        <th className="py-2 font-medium text-right text-gray-600">P. Unitario</th>
                                        <th className="py-2 font-medium text-right text-gray-600">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pedido.detalles?.map((det) => (
                                        <tr key={det.id}>
                                            <td className="py-2 font-medium text-gray-900">
                                                {det.producto?.nombre}
                                            </td>
                                            <td className="py-2 text-center text-gray-600">{det.cantidad}</td>
                                            <td className="py-2 text-right text-gray-600">
                                                {formatPrice(det.precio_unitario)}
                                            </td>
                                            <td className="py-2 font-semibold text-right text-gray-900">
                                                {formatPrice(det.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-200">
                                        <td colSpan={3} className="py-3 font-semibold text-right text-gray-700">
                                            Total:
                                        </td>
                                        <td className="py-3 text-lg font-bold text-right text-gray-900">
                                            {formatPrice(pedido.total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Cambiar estado */}
                {can('pedidos.editar') && !esCancelado && !esEntregado && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Send className="w-4 h-4" />
                                Cambiar estado
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCambiarEstado} className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex-1">
                                    <select
                                        value={nuevoEstadoId}
                                        onChange={(e) => setNuevoEstadoId(e.target.value)}
                                        className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    >
                                        <option value="">Seleccionar nuevo estado...</option>
                                        {estados
                                            .filter((e) => e.id !== pedido.estado_id)
                                            .map((est) => (
                                                <option key={est.id} value={est.id}>
                                                    {estadoLabels[est.nombre] || est.nombre}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        placeholder="Comentario (opcional)"
                                    />
                                </div>
                                <Button type="submit" disabled={!nuevoEstadoId || processing}>
                                    {processing ? 'Actualizando...' : 'Actualizar'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Historial */}
                {pedido.historial?.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="w-4 h-4" />
                                Historial de cambios
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pedido.historial.map((h) => (
                                    <div key={h.id} className="flex items-start gap-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {h.estado_anterior ? (
                                                    <>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {estadoLabels[h.estado_anterior?.nombre] || h.estado_anterior?.nombre}
                                                        </Badge>
                                                        <span className="text-gray-400">→</span>
                                                    </>
                                                ) : null}
                                                <Badge variant={estadoVariants[h.estado_nuevo?.nombre] || 'secondary'} className="text-xs">
                                                    {estadoLabels[h.estado_nuevo?.nombre] || h.estado_nuevo?.nombre}
                                                </Badge>
                                            </div>
                                            {h.comentario && (
                                                <p className="text-gray-600 mt-0.5">{h.comentario}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {h.usuario?.name} · {formatShortDate(h.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pagos (preview, se completa en Fase 11) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CreditCard className="w-4 h-4" />
                            Pagos ({pedido.pagos?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pedido.pagos?.length === 0 ? (
                            <p className="py-4 text-sm text-center text-gray-400">
                                No hay pagos registrados para este pedido.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-2 font-medium text-left text-gray-600">Fecha</th>
                                            <th className="py-2 font-medium text-left text-gray-600">Método</th>
                                            <th className="py-2 font-medium text-right text-gray-600">Monto</th>
                                            <th className="py-2 font-medium text-center text-gray-600">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pedido.pagos.map((pago) => (
                                            <tr key={pago.id}>
                                                <td className="py-2 text-gray-600">{formatShortDate(pago.created_at)}</td>
                                                <td className="py-2 text-gray-600 capitalize">{pago.metodo_pago}</td>
                                                <td className="py-2 font-semibold text-right">{formatPrice(pago.monto)}</td>
                                                <td className="py-2 text-center">
                                                    <Badge variant={pago.estado === 'confirmado' ? 'success' : 'warning'}>
                                                        {pago.estado}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}