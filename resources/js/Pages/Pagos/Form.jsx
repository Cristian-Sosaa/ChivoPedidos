// resources/js/Pages/Pagos/Form.jsx
import { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';

const metodos = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'otro', label: 'Otro' },
];

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

export default function Form({ pedidos, pedidoSeleccionado }) {
    const { data, setData, post, processing, errors } = useForm({
        pedido_id: pedidoSeleccionado?.id || '',
        monto: '',
        metodo_pago: 'efectivo',
        referencia: '',
    });

    const [pedidoActual, setPedidoActual] = useState(null);

    useEffect(() => {
        if (pedidoSeleccionado) {
            setPedidoActual({
                id: pedidoSeleccionado.id,
                cliente_nombre: pedidoSeleccionado.cliente?.nombre,
                total: pedidoSeleccionado.total,
                saldo_pendiente: pedidoSeleccionado.saldo_pendiente,
            });
        }
    }, [pedidoSeleccionado]);

    function handlePedidoChange(pedidoId) {
        setData('pedido_id', pedidoId);
        const selected = pedidos.find((p) => p.id === Number(pedidoId));
        setPedidoActual(selected || null);
    }

    function handleMontoCompleto() {
        if (pedidoActual) {
            setData('monto', pedidoActual.saldo_pendiente);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post('/pagos');
    }

    const necesitaReferencia = ['tarjeta', 'transferencia', 'cheque'].includes(data.metodo_pago);

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/pagos">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Registrar pago</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Registrá un pago para un pedido existente
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Selección de pedido */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="pedido_id">
                                    Seleccionar pedido <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="pedido_id"
                                    value={data.pedido_id}
                                    onChange={(e) => handlePedidoChange(e.target.value)}
                                    className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                >
                                    <option value="">Seleccionar pedido...</option>
                                    {pedidos.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            #{String(p.id).padStart(4, '0')} — {p.cliente_nombre} — Saldo: {formatPrice(p.saldo_pendiente)}
                                        </option>
                                    ))}
                                </select>
                                {errors.pedido_id && (
                                    <p className="text-sm text-red-600">{errors.pedido_id}</p>
                                )}
                            </div>

                            {/* Resumen del pedido seleccionado */}
                            {pedidoActual && (
                                <div className="grid grid-cols-3 gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-500">Cliente</p>
                                        <p className="text-sm font-semibold text-gray-900">{pedidoActual.cliente_nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Total del pedido</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatPrice(pedidoActual.total)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Saldo pendiente</p>
                                        <p className="text-sm font-semibold text-red-600">{formatPrice(pedidoActual.saldo_pendiente)}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Datos del pago */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Datos del pago</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Monto */}
                            <div className="space-y-2">
                                <Label htmlFor="monto">
                                    Monto <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                        <Input
                                            id="monto"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={pedidoActual?.saldo_pendiente || 99999999}
                                            value={data.monto}
                                            onChange={(e) => setData('monto', e.target.value)}
                                            placeholder="0.00"
                                            className="pl-9"
                                        />
                                    </div>
                                    {pedidoActual && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleMontoCompleto}
                                            title="Pagar saldo completo"
                                        >
                                            Pago total
                                        </Button>
                                    )}
                                </div>
                                {errors.monto && (
                                    <p className="text-sm text-red-600">{errors.monto}</p>
                                )}
                            </div>

                            {/* Método de pago */}
                            <div className="space-y-2">
                                <Label htmlFor="metodo_pago">
                                    Método de pago <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                    {metodos.map((m) => (
                                        <button
                                            key={m.value}
                                            type="button"
                                            onClick={() => setData('metodo_pago', m.value)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                                data.metodo_pago === m.value
                                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.metodo_pago && (
                                    <p className="text-sm text-red-600">{errors.metodo_pago}</p>
                                )}
                            </div>

                            {/* Referencia */}
                            <div className="space-y-2">
                                <Label htmlFor="referencia">
                                    Referencia / comprobante
                                    {necesitaReferencia && <span className="ml-1 text-xs text-gray-400">(recomendado)</span>}
                                </Label>
                                <Input
                                    id="referencia"
                                    type="text"
                                    value={data.referencia}
                                    onChange={(e) => setData('referencia', e.target.value)}
                                    placeholder={
                                        data.metodo_pago === 'tarjeta'
                                            ? 'Últimos 4 dígitos o autorización...'
                                            : data.metodo_pago === 'transferencia'
                                              ? 'Número de transferencia...'
                                              : data.metodo_pago === 'cheque'
                                                ? 'Número de cheque...'
                                                : 'Referencia opcional...'
                                    }
                                />
                                {errors.referencia && (
                                    <p className="text-sm text-red-600">{errors.referencia}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/pagos">
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={processing || !data.pedido_id || !data.monto}>
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Registrando...' : 'Registrar pago'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}