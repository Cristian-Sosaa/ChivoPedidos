// resources/js/Pages/Pedidos/Show.jsx
import { useState, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
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
    Plus,
    Trash2,
    Minus,
    Printer,
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

export default function Show({ pedido, estados, totalPagado, saldoPendiente, productosDisponibles }) {
    const { can } = usePermissions();
    const [nuevoEstadoId, setNuevoEstadoId] = useState('');
    const [comentario, setComentario] = useState('');
    const [processing, setProcessing] = useState(false);

    // Agregar producto
    const [showAgregar, setShowAgregar] = useState(false);
    const [nuevoProductoId, setNuevoProductoId] = useState('');
    const [nuevaCantidad, setNuevaCantidad] = useState(1);

    // Eliminar línea
    const [confirmEliminar, setConfirmEliminar] = useState(null);

    // Editar cantidad
    const [editandoCantidad, setEditandoCantidad] = useState(null);
    const [cantidadTemp, setCantidadTemp] = useState('');

    const esCancelado = pedido.estado?.nombre === 'cancelado';
    const esEntregado = pedido.estado?.nombre === 'entregado';
    const puedeEditar = can('pedidos.editar') && !esCancelado && !esEntregado;

    const comprobanteRef = useRef(null);

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

    function handleAgregarProducto(e) {
        e.preventDefault();
        if (!nuevoProductoId) return;
        setProcessing(true);
        router.post(`/pedidos/${pedido.id}/detalle`, {
            producto_id: nuevoProductoId,
            cantidad: nuevaCantidad,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setNuevoProductoId('');
                setNuevaCantidad(1);
                setShowAgregar(false);
            },
        });
    }

    function handleEliminarDetalle() {
        if (!confirmEliminar) return;
        router.delete(`/pedidos/${pedido.id}/detalle/${confirmEliminar.id}`, {
            preserveScroll: true,
            onFinish: () => setConfirmEliminar(null),
        });
    }

    function handleActualizarCantidad(detalleId) {
        const cant = parseInt(cantidadTemp);
        if (!cant || cant < 1) return;
        setProcessing(true);
        router.patch(`/pedidos/${pedido.id}/detalle/${detalleId}/cantidad`, {
            cantidad: cant,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setEditandoCantidad(null);
                setCantidadTemp('');
            },
        });
    }

    function handleImprimir() {
        const contenido = comprobanteRef.current;
        if (!contenido) return;

        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Pedido #${String(pedido.id).padStart(4, '0')}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
                    h1 { font-size: 22px; margin-bottom: 4px; }
                    .subtitle { color: #666; font-size: 13px; margin-bottom: 20px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
                    .info-item label { font-size: 11px; color: #999; text-transform: uppercase; display: block; }
                    .info-item span { font-size: 14px; font-weight: 600; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th { text-align: left; padding: 8px; border-bottom: 2px solid #ddd; font-size: 12px; color: #666; }
                    td { padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .total-row td { border-top: 2px solid #333; font-weight: bold; font-size: 15px; }
                    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
                    .badge-pendiente { background: #fef3c7; color: #92400e; }
                    .badge-en_proceso { background: #dbeafe; color: #1e40af; }
                    .badge-enviado { background: #e0e7ff; color: #3730a3; }
                    .badge-entregado { background: #d1fae5; color: #065f46; }
                    .badge-cancelado { background: #fee2e2; color: #991b1b; }
                    .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <h1>Pedido #${String(pedido.id).padStart(4, '0')}</h1>
                <p class="subtitle">Fecha: ${formatDate(pedido.created_at)}</p>

                <div class="info-grid">
                    <div class="info-item">
                        <label>Cliente</label>
                        <span>${pedido.cliente?.nombre}</span>
                    </div>
                    <div class="info-item">
                        <label>Estado</label>
                        <span class="badge badge-${pedido.estado?.nombre}">${estadoLabels[pedido.estado?.nombre] || pedido.estado?.nombre}</span>
                    </div>
                    <div class="info-item">
                        <label>Atendido por</label>
                        <span>${pedido.usuario?.name}</span>
                    </div>
                    <div class="info-item">
                        <label>Total</label>
                        <span>${formatPrice(pedido.total)}</span>
                    </div>
                </div>

                ${pedido.observaciones ? `<p style="font-size:13px;color:#555;margin-bottom:16px;"><strong>Observaciones:</strong> ${pedido.observaciones}</p>` : ''}

                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th class="text-center">Cant.</th>
                            <th class="text-right">P. Unit.</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedido.detalles?.map((d) => `
                            <tr>
                                <td>${d.producto?.nombre}</td>
                                <td class="text-center">${d.cantidad}</td>
                                <td class="text-right">${formatPrice(d.precio_unitario)}</td>
                                <td class="text-right">${formatPrice(d.subtotal)}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td colspan="3" class="text-right">Total:</td>
                            <td class="text-right">${formatPrice(pedido.total)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <p>Chivo Pedidos — Comprobante de pedido</p>
                </div>
            </body>
            </html>
        `);
        ventana.document.close();
        ventana.print();
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto space-y-6" ref={comprobanteRef}>
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
                                Creado el {formatDate(pedido.created_at)} por {pedido.usuario?.name}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleImprimir} className="hidden sm:flex">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                    </Button>
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
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Package className="w-4 h-4" />
                                Productos ({pedido.detalles?.length || 0})
                            </CardTitle>
                            {puedeEditar && productosDisponibles.length > 0 && (
                                <Button variant="outline" size="sm" onClick={() => setShowAgregar(!showAgregar)}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Agregar
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Formulario para agregar producto */}
                        {showAgregar && (
                            <form onSubmit={handleAgregarProducto} className="flex flex-col gap-3 p-3 mb-4 border border-gray-100 rounded-lg sm:flex-row bg-gray-50">
                                <div className="flex-1">
                                    <select
                                        value={nuevoProductoId}
                                        onChange={(e) => setNuevoProductoId(e.target.value)}
                                        className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    >
                                        <option value="">Seleccionar producto...</option>
                                        {productosDisponibles.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre} — {formatPrice(p.precio)} (stock: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={nuevaCantidad}
                                        onChange={(e) => setNuevaCantidad(parseInt(e.target.value) || 1)}
                                        className="text-center"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" size="sm" disabled={!nuevoProductoId || processing}>
                                        Agregar
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAgregar(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-2 font-medium text-left text-gray-600">Producto</th>
                                        <th className="py-2 font-medium text-center text-gray-600">Cantidad</th>
                                        <th className="py-2 font-medium text-right text-gray-600">P. Unitario</th>
                                        <th className="py-2 font-medium text-right text-gray-600">Subtotal</th>
                                        {puedeEditar && (
                                            <th className="w-20 py-2 font-medium text-center text-gray-600">Acc.</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pedido.detalles?.map((det) => (
                                        <tr key={det.id}>
                                            <td className="py-2 font-medium text-gray-900">
                                                {det.producto?.nombre}
                                            </td>
                                            <td className="py-2 text-center text-gray-600">
                                                {editandoCantidad === det.id ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={cantidadTemp}
                                                            onChange={(e) => setCantidadTemp(e.target.value)}
                                                            className="w-20 text-xs text-center h-7"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleActualizarCantidad(det.id);
                                                                }
                                                                if (e.key === 'Escape') {
                                                                    setEditandoCantidad(null);
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => handleActualizarCantidad(det.id)}
                                                        >
                                                            <Send className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        className={puedeEditar ? 'cursor-pointer hover:text-indigo-600 hover:underline' : ''}
                                                        onClick={() => {
                                                            if (puedeEditar) {
                                                                setEditandoCantidad(det.id);
                                                                setCantidadTemp(String(det.cantidad));
                                                            }
                                                        }}
                                                        title={puedeEditar ? 'Clic para editar cantidad' : ''}
                                                    >
                                                        {det.cantidad}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2 text-right text-gray-600">
                                                {formatPrice(det.precio_unitario)}
                                            </td>
                                            <td className="py-2 font-semibold text-right text-gray-900">
                                                {formatPrice(det.subtotal)}
                                            </td>
                                            {puedeEditar && (
                                                <td className="py-2 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 h-7 w-7 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setConfirmEliminar(det)}
                                                        title="Eliminar producto"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-200">
                                        <td colSpan={puedeEditar ? 3 : 3} className="py-3 font-semibold text-right text-gray-700">
                                            Total:
                                        </td>
                                        <td className="py-3 text-lg font-bold text-right text-gray-900">
                                            {formatPrice(pedido.total)}
                                        </td>
                                        {puedeEditar && <td />}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Cambiar estado */}
                {puedeEditar && (
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

                {/* Pagos */}
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
                                            <th className="hidden py-2 font-medium text-left text-gray-600 sm:table-cell">Referencia</th>
                                            <th className="py-2 font-medium text-right text-gray-600">Monto</th>
                                            <th className="py-2 font-medium text-center text-gray-600">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pedido.pagos.map((pago) => (
                                            <tr key={pago.id}>
                                                <td className="py-2 text-gray-600">{formatShortDate(pago.created_at)}</td>
                                                <td className="py-2 text-gray-600 capitalize">{pago.metodo_pago}</td>
                                                <td className="hidden py-2 text-gray-500 sm:table-cell">{pago.referencia || '—'}</td>
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

            {/* Modal confirmar eliminar producto */}
            <ConfirmDialog
                open={!!confirmEliminar}
                title="Eliminar producto del pedido"
                message={`¿Estás seguro de eliminar "${confirmEliminar?.producto?.nombre}" del pedido? El stock será devuelto.`}
                confirmText="Eliminar"
                variant="destructive"
                onConfirm={handleEliminarDetalle}
                onCancel={() => setConfirmEliminar(null)}
            />
        </AuthenticatedLayout>
    );
}