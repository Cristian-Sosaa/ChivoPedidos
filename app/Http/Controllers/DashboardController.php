<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\Pago;
use App\Models\PedidoDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $hoy = Carbon::today();
        $inicioMes = Carbon::now()->startOfMonth();
        $inicioSemana = Carbon::now()->startOfWeek();

        // ─── Métricas principales ───────────────────────
        $totalProductos = Producto::where('activo', true)->count();
        $totalClientes = Cliente::where('activo', true)->count();
        $totalPedidos = Pedido::count();

        $ingresosMes = Pago::where('estado', 'confirmado')
            ->whereDate('created_at', '>=', $inicioMes)
            ->sum('monto');

        $pedidosHoy = Pedido::whereDate('created_at', $hoy)->count();
        $pedidosSemana = Pedido::whereDate('created_at', '>=', $inicioSemana)->count();
        $pedidosMes = Pedido::whereDate('created_at', '>=', $inicioMes)->count();

        $ingresosHoy = Pago::where('estado', 'confirmado')
            ->whereDate('created_at', $hoy)
            ->sum('monto');

        // ─── Pedidos por estado ─────────────────────────
        $pedidosPorEstado = Pedido::join('estados_pedido', 'pedidos.estado_id', '=', 'estados_pedido.id')
            ->select('estados_pedido.nombre', DB::raw('count(*) as total'))
            ->groupBy('estados_pedido.nombre')
            ->get()
            ->map(fn ($item) => [
                'estado' => $item->nombre,
                'total' => $item->total,
            ])
            ->toArray();

        // ─── Ventas últimos 7 días ──────────────────────
        $ventasUltimos7Dias = [];
        for ($i = 6; $i >= 0; $i--) {
            $fecha = Carbon::today()->subDays($i);
            $total = Pago::where('estado', 'confirmado')
                ->whereDate('created_at', $fecha)
                ->sum('monto');
            $ventasUltimos7Dias[] = [
                'fecha' => $fecha->format('d/m'),
                'dia' => $fecha->locale('es')->isoFormat('ddd'),
                'total' => round((float) $total, 2),
            ];
        }

        // ─── Ventas últimos 6 meses ─────────────────────
        $ventasMensuales = [];
        for ($i = 5; $i >= 0; $i--) {
            $mes = Carbon::now()->subMonths($i);
            $total = Pago::where('estado', 'confirmado')
                ->whereYear('created_at', $mes->year)
                ->whereMonth('created_at', $mes->month)
                ->sum('monto');
            $ventasMensuales[] = [
                'mes' => $mes->locale('es')->isoFormat('MMM YYYY'),
                'total' => round((float) $total, 2),
            ];
        }

        // ─── Top 5 productos más vendidos ───────────────
        $topProductos = PedidoDetalle::join('productos', 'pedido_detalle.producto_id', '=', 'productos.id')
            ->select(
                'productos.nombre',
                DB::raw('SUM(pedido_detalle.cantidad) as total_vendido'),
                DB::raw('SUM(pedido_detalle.subtotal) as total_ingresos')
            )
            ->groupBy('productos.id', 'productos.nombre')
            ->orderByDesc('total_vendido')
            ->limit(5)
            ->get()
            ->toArray();

        // ─── Pedidos recientes ──────────────────────────
        $pedidosRecientes = Pedido::with(['cliente', 'estado', 'usuario'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // ─── Alertas de stock ───────────────────────────
        $productosSinStock = Producto::where('activo', true)
            ->where('stock', 0)
            ->orderBy('nombre')
            ->limit(5)
            ->get(['id', 'nombre', 'stock']);

        $productosStockBajo = Producto::where('activo', true)
            ->where('stock', '>', 0)
            ->where('stock', '<=', 10)
            ->orderBy('stock')
            ->limit(5)
            ->get(['id', 'nombre', 'stock']);

        // ─── Top 5 clientes ────────────────────────────
        $topClientes = Pedido::join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
            ->select(
                'clientes.nombre',
                DB::raw('COUNT(pedidos.id) as total_pedidos'),
                DB::raw('SUM(pedidos.total) as total_compras')
            )
            ->groupBy('clientes.id', 'clientes.nombre')
            ->orderByDesc('total_compras')
            ->limit(5)
            ->get()
            ->toArray();

        return Inertia::render('Dashboard', [
            'metricas' => [
                'total_productos' => $totalProductos,
                'total_clientes' => $totalClientes,
                'total_pedidos' => $totalPedidos,
                'ingresos_mes' => round((float) $ingresosMes, 2),
                'pedidos_hoy' => $pedidosHoy,
                'pedidos_semana' => $pedidosSemana,
                'pedidos_mes' => $pedidosMes,
                'ingresos_hoy' => round((float) $ingresosHoy, 2),
            ],
            'pedidosPorEstado' => $pedidosPorEstado,
            'ventasUltimos7Dias' => $ventasUltimos7Dias,
            'ventasMensuales' => $ventasMensuales,
            'topProductos' => $topProductos,
            'topClientes' => $topClientes,
            'pedidosRecientes' => $pedidosRecientes,
            'productosSinStock' => $productosSinStock,
            'productosStockBajo' => $productosStockBajo,
        ]);
    }
}