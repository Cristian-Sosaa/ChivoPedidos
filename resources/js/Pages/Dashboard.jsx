// resources/js/Pages/Dashboard.jsx
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { ChartTooltip } from '@/Components/charts/ChartTooltip';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import {
    Package, Users, ShoppingCart, DollarSign,
    TrendingUp, CalendarDays, AlertTriangle, XCircle,
    ArrowRight, Trophy, Eye,
} from 'lucide-react';

const estadoVariants = {
    pendiente: 'warning', en_proceso: 'default', enviado: 'default',
    entregado: 'success', cancelado: 'destructive',
};
const estadoLabels = {
    pendiente: 'Pendiente', en_proceso: 'En proceso', enviado: 'Enviado',
    entregado: 'Entregado', cancelado: 'Cancelado',
};
const estadoColores = {
    pendiente: '#f59e0b', en_proceso: '#3b82f6', enviado: '#6366f1',
    entregado: '#10b981', cancelado: '#ef4444',
};

function formatPrice(v) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v || 0);
}
function formatDate(d) {
    return new Date(d).toLocaleDateString('es-SV', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

export default function Dashboard({
    metricas, pedidosPorEstado, ventasUltimos7Dias, ventasMensuales,
    topProductos, topClientes, pedidosRecientes, productosSinStock, productosStockBajo,
}) {
    const totalAlertasStock = productosSinStock.length + productosStockBajo.length;
    const maxVendido = topProductos.length > 0 ? Math.max(...topProductos.map((p) => p.total_vendido)) : 1;

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Resumen general del sistema</p>
                </div>

                {/* Métricas principales */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Productos</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{metricas.total_productos}</p>
                                </div>
                                <div className="flex items-center justify-center bg-blue-100 rounded-lg w-11 h-11">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Clientes</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{metricas.total_clientes}</p>
                                </div>
                                <div className="flex items-center justify-center bg-green-100 rounded-lg w-11 h-11">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Pedidos</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{metricas.total_pedidos}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Hoy: {metricas.pedidos_hoy} · Semana: {metricas.pedidos_semana}</p>
                                </div>
                                <div className="flex items-center justify-center bg-indigo-100 rounded-lg w-11 h-11">
                                    <ShoppingCart className="w-5 h-5 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Ingresos del mes</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(metricas.ingresos_mes)}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Hoy: {formatPrice(metricas.ingresos_hoy)}</p>
                                </div>
                                <div className="flex items-center justify-center rounded-lg w-11 h-11 bg-amber-100">
                                    <DollarSign className="w-5 h-5 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráficos de ventas */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Ventas últimos 7 días — Area Chart con gradiente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="w-4 h-4" />
                                Ventas últimos 7 días
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ventasUltimos7Dias.every((d) => d.total === 0) ? (
                                <p className="py-8 text-sm text-center text-gray-400">No hay ventas en los últimos 7 días.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <AreaChart data={ventasUltimos7Dias} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gradientVentas7" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                        <Tooltip content={<ChartTooltip formatter={formatPrice} />} />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            name="Ventas"
                                            stroke="#6366f1"
                                            strokeWidth={2.5}
                                            fill="url(#gradientVentas7)"
                                            dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ventas mensuales — Bar Chart con gradiente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarDays className="w-4 h-4" />
                                Ventas mensuales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ventasMensuales.every((d) => d.total === 0) ? (
                                <p className="py-8 text-sm text-center text-gray-400">No hay datos de ventas mensuales.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={ventasMensuales} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                        <linearGradient id="gradientBarMensual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                                        </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                        <Tooltip content={<ChartTooltip formatter={formatPrice} />} />
                                        <Bar
                                            dataKey="total"
                                            name="Ingresos"
                                            fill="url(#gradientBarMensual)"
                                            radius={[6, 6, 0, 0]}
                                            barSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pedidos por estado (Pie) + Top productos */}


                {/* Pedidos recientes + Alertas / Top clientes */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Pedidos recientes */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Pedidos recientes</CardTitle>
                                <Link href="/pedidos">
                                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                        Ver todos <ArrowRight className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {pedidosRecientes.length === 0 ? (
                                <p className="py-4 text-sm text-center text-gray-400">No hay pedidos registrados.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="py-2 font-medium text-left text-gray-500">#</th>
                                                <th className="py-2 font-medium text-left text-gray-500">Cliente</th>
                                                <th className="hidden py-2 font-medium text-left text-gray-500 sm:table-cell">Fecha</th>
                                                <th className="py-2 font-medium text-center text-gray-500">Estado</th>
                                                <th className="py-2 font-medium text-right text-gray-500">Total</th>
                                                <th className="w-10" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {pedidosRecientes.map((pedido) => (
                                                <tr key={pedido.id} className="hover:bg-gray-50">
                                                    <td className="py-2 font-mono font-semibold text-gray-900">#{String(pedido.id).padStart(4, '0')}</td>
                                                    <td className="py-2 text-gray-700">{pedido.cliente?.nombre}</td>
                                                    <td className="hidden py-2 text-xs text-gray-500 sm:table-cell">{formatDate(pedido.created_at)}</td>
                                                    <td className="py-2 text-center">
                                                        <Badge variant={estadoVariants[pedido.estado?.nombre] || 'secondary'} className="text-xs">
                                                            {estadoLabels[pedido.estado?.nombre] || pedido.estado?.nombre}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-2 font-semibold text-right">{formatPrice(pedido.total)}</td>
                                                    <td className="py-2 text-center">
                                                        <Link href={`/pedidos/${pedido.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Columna derecha */}
                    <div className="space-y-6">
                        {/* Alertas de stock */}
                        {totalAlertasStock > 0 && (
                            <Card className="">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            Alertas de stock
                                        </CardTitle>
                                        <Link href="/inventario">
                                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                                Ver todo <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {productosSinStock.map((prod) => (
                                            <div key={prod.id} className="flex items-center justify-between py-1.5">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                                    <span className="text-sm text-gray-700 truncate">{prod.nombre}</span>
                                                </div>
                                                <Badge variant="destructive" className="text-xs shrink-0">Sin stock</Badge>
                                            </div>
                                        ))}
                                        {productosStockBajo.map((prod) => (
                                            <div key={prod.id} className="flex items-center justify-between py-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-700 truncate">{prod.nombre}</span>
                                                </div>
                                                <Badge variant="warning" className="text-xs shrink-0">{prod.stock} uds</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Top clientes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    Top clientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {topClientes.length === 0 ? (
                                    <p className="py-4 text-sm text-center text-gray-400">Sin datos.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {topClientes.map((cli, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full shrink-0">
                                                    {cli.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{cli.nombre}</p>
                                                    <p className="text-xs text-gray-400">{cli.total_pedidos} pedidos</p>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 shrink-0">{formatPrice(cli.total_compras)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}