// resources/js/Pages/Inventario/Index.jsx
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import {
    Search,
    Package,
    AlertTriangle,
    XCircle,
    CheckCircle2,
    DollarSign,
    ArrowUpCircle,
    ArrowDownCircle,
    Settings2,
} from 'lucide-react';

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function getStockLevel(stock, umbral) {
    if (stock === 0) return { label: 'Sin stock', variant: 'destructive', icon: XCircle, color: 'text-red-600' };
    if (stock <= umbral) return { label: 'Bajo', variant: 'warning', icon: AlertTriangle, color: 'text-amber-600' };
    return { label: 'Normal', variant: 'success', icon: CheckCircle2, color: 'text-green-600' };
}

function StockBar({ stock, umbral }) {
    const max = Math.max(umbral * 3, stock, 1);
    const percent = Math.min((stock / max) * 100, 100);
    const color = stock === 0 ? 'bg-red-500' : stock <= umbral ? 'bg-amber-500' : 'bg-green-500';

    return (
        <div className="w-full h-2 bg-gray-100 rounded-full">
            <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
        </div>
    );
}

export default function Index({ productos, resumen, umbral, filters }) {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters?.search || '');

    // Modal de ajuste
    const [ajusteModal, setAjusteModal] = useState(null);
    const [ajusteTipo, setAjusteTipo] = useState('entrada');
    const [ajusteCantidad, setAjusteCantidad] = useState('');
    const [processing, setProcessing] = useState(false);

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    function applyFilters(newFilters) {
        router.get('/inventario', { ...filters, ...newFilters }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleAjuste(e) {
        e.preventDefault();
        if (!ajusteModal || !ajusteCantidad) return;

        setProcessing(true);
        router.patch(`/inventario/${ajusteModal.id}/ajustar`, {
            tipo: ajusteTipo,
            cantidad: parseInt(ajusteCantidad),
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setAjusteModal(null);
                setAjusteTipo('entrada');
                setAjusteCantidad('');
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
                    <p className="mt-1 text-sm text-gray-500">Control de stock y alertas de inventario</p>
                </div>

                {/* Tarjetas de resumen */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <Card className="transition-colors cursor-pointer hover:border-gray-300" onClick={() => applyFilters({ nivel: '' })}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="text-xl font-bold text-gray-900">{resumen.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer hover:border-red-300 transition-colors ${filters?.nivel === 'sin_stock' ? 'border-red-400 bg-red-50' : ''}`}
                        onClick={() => applyFilters({ nivel: 'sin_stock' })}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Sin stock</p>
                                    <p className="text-xl font-bold text-red-600">{resumen.sin_stock}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer hover:border-amber-300 transition-colors ${filters?.nivel === 'bajo' ? 'border-amber-400 bg-amber-50' : ''}`}
                        onClick={() => applyFilters({ nivel: 'bajo' })}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Stock bajo</p>
                                    <p className="text-xl font-bold text-amber-600">{resumen.stock_bajo}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer hover:border-green-300 transition-colors ${filters?.nivel === 'normal' ? 'border-green-400 bg-green-50' : ''}`}
                        onClick={() => applyFilters({ nivel: 'normal' })}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Normal</p>
                                    <p className="text-xl font-bold text-green-600">{resumen.stock_normal}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-2 lg:col-span-1">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Valor total</p>
                                    <p className="text-lg font-bold text-gray-900">{formatPrice(resumen.valor_inventario)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Búsqueda y umbral */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <Input
                                type="text"
                                placeholder="Buscar producto o categoría..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Buscar</Button>
                    </form>

                    <div className="flex items-center gap-2">
                        <Label className="text-xs text-gray-500 whitespace-nowrap">Umbral alerta:</Label>
                        <Input
                            type="number"
                            min="1"
                            value={filters?.umbral || umbral}
                            onChange={(e) => applyFilters({ umbral: e.target.value })}
                            className="w-20 text-center"
                        />
                    </div>
                </div>

                {/* Tabla de inventario */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Producto</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 md:table-cell">Categoría</th>
                                    <th className="hidden px-4 py-3 font-medium text-right text-gray-600 sm:table-cell">Precio</th>
                                    <th className="w-32 px-4 py-3 font-medium text-center text-gray-600">Stock</th>
                                    <th className="hidden w-40 px-4 py-3 font-medium text-center text-gray-600 lg:table-cell">Nivel</th>
                                    <th className="px-4 py-3 font-medium text-center text-gray-600">Estado</th>
                                    {can('productos.editar') && (
                                        <th className="w-24 px-4 py-3 font-medium text-center text-gray-600">Ajustar</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productos.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                            No se encontraron productos.
                                        </td>
                                    </tr>
                                ) : (
                                    productos.data.map((producto) => {
                                        const level = getStockLevel(producto.stock, umbral);
                                        return (
                                            <tr key={producto.id} className={`hover:bg-gray-50 transition-colors ${producto.stock === 0 ? 'bg-red-50/50' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                                                    <p className="text-xs text-gray-400 md:hidden">
                                                        {producto.categoria?.nombre || 'Sin categoría'}
                                                    </p>
                                                </td>
                                                <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                                                    {producto.categoria?.nombre || (
                                                        <span className="text-gray-300">Sin categoría</span>
                                                    )}
                                                </td>
                                                <td className="hidden px-4 py-3 text-right text-gray-700 sm:table-cell">
                                                    {formatPrice(producto.precio)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`text-lg font-bold ${level.color}`}>
                                                        {producto.stock}
                                                    </span>
                                                </td>
                                                <td className="hidden px-4 py-3 lg:table-cell">
                                                    <StockBar stock={producto.stock} umbral={umbral} />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant={level.variant}>
                                                        {level.label}
                                                    </Badge>
                                                </td>
                                                {can('productos.editar') && (
                                                    <td className="px-4 py-3 text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setAjusteModal(producto)}
                                                            title="Ajustar stock"
                                                        >
                                                            <Settings2 className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 pb-4">
                        <Pagination
                            links={productos.links}
                            meta={{ from: productos.from, to: productos.to, total: productos.total }}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de ajuste de stock */}
            {ajusteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setAjusteModal(null)} />
                    <div className="relative w-full max-w-sm p-6 mx-4 bg-white rounded-lg shadow-xl">
                        <h3 className="mb-1 text-base font-semibold text-gray-900">Ajustar stock</h3>
                        <p className="mb-4 text-sm text-gray-500">
                            {ajusteModal.nombre} — Stock actual: <span className="font-bold">{ajusteModal.stock}</span>
                        </p>

                        <form onSubmit={handleAjuste} className="space-y-4">
                            {/* Tipo de ajuste */}
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAjusteTipo('entrada')}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                                        ajusteTipo === 'entrada'
                                            ? 'bg-green-50 border-green-300 text-green-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpCircle className="w-5 h-5" />
                                    Entrada
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAjusteTipo('salida')}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                                        ajusteTipo === 'salida'
                                            ? 'bg-red-50 border-red-300 text-red-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowDownCircle className="w-5 h-5" />
                                    Salida
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAjusteTipo('ajuste')}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                                        ajusteTipo === 'ajuste'
                                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Settings2 className="w-5 h-5" />
                                    Ajuste
                                </button>
                            </div>

                            {/* Cantidad */}
                            <div className="space-y-2">
                                <Label>
                                    {ajusteTipo === 'entrada'
                                        ? 'Cantidad a agregar'
                                        : ajusteTipo === 'salida'
                                          ? 'Cantidad a retirar'
                                          : 'Nuevo stock'}
                                </Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={ajusteCantidad}
                                    onChange={(e) => setAjusteCantidad(e.target.value)}
                                    placeholder={ajusteTipo === 'ajuste' ? 'Stock final' : 'Cantidad'}
                                    autoFocus
                                />
                                {ajusteTipo !== 'ajuste' && ajusteCantidad && (
                                    <p className="text-xs text-gray-500">
                                        Stock resultante:{' '}
                                        <span className="font-semibold">
                                            {ajusteTipo === 'entrada'
                                                ? ajusteModal.stock + parseInt(ajusteCantidad || 0)
                                                : Math.max(0, ajusteModal.stock - parseInt(ajusteCantidad || 0))}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setAjusteModal(null)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={!ajusteCantidad || processing}>
                                    {processing ? 'Guardando...' : 'Aplicar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}