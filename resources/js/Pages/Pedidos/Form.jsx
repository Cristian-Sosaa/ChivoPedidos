// resources/js/Pages/Pedidos/Form.jsx
import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart } from 'lucide-react';

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

export default function Form({ clientes, productos, estados }) {
    const estadoPendiente = estados.find((e) => e.nombre === 'pendiente');

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: '',
        estado_id: estadoPendiente?.id || '',
        observaciones: '',
        detalles: [],
    });

    function agregarProducto() {
        setData('detalles', [
            ...data.detalles,
            { producto_id: '', cantidad: 1 },
        ]);
    }

    function actualizarDetalle(index, field, value) {
        const nuevos = [...data.detalles];
        nuevos[index][field] = value;
        setData('detalles', nuevos);
    }

    function eliminarDetalle(index) {
        const nuevos = data.detalles.filter((_, i) => i !== index);
        setData('detalles', nuevos);
    }

    function getProducto(productoId) {
        return productos.find((p) => p.id === Number(productoId));
    }

    function calcularSubtotal(detalle) {
        const producto = getProducto(detalle.producto_id);
        if (!producto || !detalle.cantidad) return 0;
        return producto.precio * detalle.cantidad;
    }

    function calcularTotal() {
        return data.detalles.reduce((sum, d) => sum + calcularSubtotal(d), 0);
    }

    function productosYaSeleccionados(excludeIndex) {
        return data.detalles
            .filter((_, i) => i !== excludeIndex)
            .map((d) => Number(d.producto_id))
            .filter(Boolean);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post('/pedidos');
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/pedidos">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Nuevo pedido</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Seleccioná un cliente, agregá productos y creá el pedido
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Datos generales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Datos del pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Cliente */}
                                <div className="space-y-2">
                                    <Label htmlFor="cliente_id">
                                        Cliente <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="cliente_id"
                                        value={data.cliente_id}
                                        onChange={(e) => setData('cliente_id', e.target.value)}
                                        className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                    >
                                        <option value="">Seleccionar cliente...</option>
                                        {clientes.map((cli) => (
                                            <option key={cli.id} value={cli.id}>{cli.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.cliente_id && (
                                        <p className="text-sm text-red-600">{errors.cliente_id}</p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <Label htmlFor="estado_id">
                                        Estado <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="estado_id"
                                        value={data.estado_id}
                                        onChange={(e) => setData('estado_id', e.target.value)}
                                        className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                    >
                                        {estados.map((est) => (
                                            <option key={est.id} value={est.id}>{est.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.estado_id && (
                                        <p className="text-sm text-red-600">{errors.estado_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="space-y-2">
                                <Label htmlFor="observaciones">Observaciones</Label>
                                <textarea
                                    id="observaciones"
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    placeholder="Notas adicionales del pedido..."
                                    rows={2}
                                    className="flex w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detalle de productos */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Productos del pedido</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={agregarProducto}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Agregar producto
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {errors.detalles && typeof errors.detalles === 'string' && (
                                <p className="mb-4 text-sm text-red-600">{errors.detalles}</p>
                            )}

                            {data.detalles.length === 0 ? (
                                <div className="py-8 text-center text-gray-400">
                                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No hay productos agregados.</p>
                                    <p className="mt-1 text-xs">Hacé clic en "Agregar producto" para comenzar.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Header de la tabla */}
                                    <div className="hidden grid-cols-12 gap-3 px-1 text-xs font-medium text-gray-500 uppercase sm:grid">
                                        <div className="col-span-5">Producto</div>
                                        <div className="col-span-2 text-center">Stock</div>
                                        <div className="col-span-2 text-center">Cantidad</div>
                                        <div className="col-span-2 text-right">Subtotal</div>
                                        <div className="col-span-1" />
                                    </div>

                                    {data.detalles.map((detalle, index) => {
                                        const producto = getProducto(detalle.producto_id);
                                        const seleccionados = productosYaSeleccionados(index);

                                        return (
                                            <div
                                                key={index}
                                                className="grid items-center grid-cols-1 gap-3 p-3 border border-gray-100 rounded-lg sm:grid-cols-12 bg-gray-50"
                                            >
                                                {/* Producto */}
                                                <div className="sm:col-span-5">
                                                    <select
                                                        value={detalle.producto_id}
                                                        onChange={(e) => actualizarDetalle(index, 'producto_id', e.target.value)}
                                                        className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        {productos.map((prod) => (
                                                            <option
                                                                key={prod.id}
                                                                value={prod.id}
                                                                disabled={seleccionados.includes(prod.id)}
                                                            >
                                                                {prod.nombre} — {formatPrice(prod.precio)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors[`detalles.${index}.producto_id`] && (
                                                        <p className="mt-1 text-xs text-red-600">
                                                            {errors[`detalles.${index}.producto_id`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Stock disponible */}
                                                <div className="text-center sm:col-span-2">
                                                    <span className="text-sm text-gray-500 sm:text-gray-600">
                                                        <span className="sm:hidden">Stock: </span>
                                                        {producto ? producto.stock : '—'}
                                                    </span>
                                                </div>

                                                {/* Cantidad */}
                                                <div className="sm:col-span-2">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={producto?.stock || 99999}
                                                        value={detalle.cantidad}
                                                        onChange={(e) => actualizarDetalle(index, 'cantidad', parseInt(e.target.value) || 1)}
                                                        className="text-center"
                                                    />
                                                    {errors[`detalles.${index}.cantidad`] && (
                                                        <p className="mt-1 text-xs text-red-600">
                                                            {errors[`detalles.${index}.cantidad`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-right sm:col-span-2">
                                                    <span className="font-semibold text-gray-900">
                                                        {formatPrice(calcularSubtotal(detalle))}
                                                    </span>
                                                </div>

                                                {/* Eliminar */}
                                                <div className="text-center sm:col-span-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => eliminarDetalle(index)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Total */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <span className="text-sm font-medium text-gray-600">
                                            {data.detalles.length} producto{data.detalles.length !== 1 ? 's' : ''}
                                        </span>
                                        <div className="text-right">
                                            <span className="mr-3 text-sm text-gray-500">Total:</span>
                                            <span className="text-xl font-bold text-gray-900">
                                                {formatPrice(calcularTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botones */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/pedidos">
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={processing || data.detalles.length === 0}>
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Guardando...' : 'Crear pedido'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}