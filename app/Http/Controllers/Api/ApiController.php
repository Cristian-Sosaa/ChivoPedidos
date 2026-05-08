<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponder;
use App\Http\Requests\CategoriaRequest;
use App\Http\Requests\ProductoRequest;
use App\Http\Requests\ClienteRequest;
use App\Http\Requests\PedidoRequest;
use App\Http\Requests\PagoRequest;
use App\Models\{Categoria, Producto, Cliente, Pedido, Pago, EstadoPedido, HistorialPedido, User};
use App\Services\PedidoService;
use App\Services\PagoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ApiController extends Controller
{
    use ApiResponder;

    public function __construct(
        private PedidoService $pedidoService,
        private PagoService $pagoService,
    ) {}

    // ─────────────────────────────────────────────────────
    // AUTH
    // ─────────────────────────────────────────────────────

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->error('Credenciales inválidas.', 401);
        }
    
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('api')->plainTextToken;
    
        return $this->success([
            'user' => $this->formatUser($user),
            'token' => $token,
        ], 'Login exitoso.');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Sesión cerrada.');
    }

    public function me(Request $request)
    {
        return $this->success($this->formatUser($request->user()));
    }

    // ─────────────────────────────────────────────────────
    // CATEGORÍAS
    // ─────────────────────────────────────────────────────

    public function categoriasIndex(Request $request)
    {
        $query = Categoria::withCount('productos');

        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('nombre', 'ilike', "%{$s}%")->orWhere('descripcion', 'ilike', "%{$s}%"));
        }
        if ($request->has('activo') && $request->activo !== '') {
            $query->where('activo', $request->boolean('activo'));
        }

        return $this->success($query->orderBy('nombre')->paginate($request->per_page ?? 10));
    }

    public function categoriasStore(CategoriaRequest $request)
    {
        return $this->created(Categoria::create($request->validated()));
    }

    public function categoriasShow(Categoria $categoria)
    {
        return $this->success($categoria->loadCount('productos'));
    }

    public function categoriasUpdate(CategoriaRequest $request, Categoria $categoria)
    {
        $categoria->update($request->validated());
        return $this->success($categoria);
    }

    public function categoriasToggle(Categoria $categoria)
    {
        $categoria->update(['activo' => !$categoria->activo]);
        return $this->success($categoria);
    }

    public function categoriasAll()
    {
        return $this->success(Categoria::activos()->orderBy('nombre')->get(['id', 'nombre']));
    }

    // ─────────────────────────────────────────────────────
    // PRODUCTOS
    // ─────────────────────────────────────────────────────

    public function productosIndex(Request $request)
    {
        $query = Producto::with('categoria');

        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('nombre', 'ilike', "%{$s}%")->orWhere('descripcion', 'ilike', "%{$s}%"));
        }
        if ($request->categoria_id) $query->where('categoria_id', $request->categoria_id);
        if ($request->has('activo') && $request->activo !== '') $query->where('activo', $request->boolean('activo'));
        if ($request->boolean('bajo_stock')) $query->bajoStock();

        return $this->success($query->orderBy('nombre')->paginate($request->per_page ?? 10));
    }

    public function productosStore(ProductoRequest $request)
    {
        return $this->created(Producto::create($request->validated())->load('categoria'));
    }

    public function productosShow(Producto $producto)
    {
        return $this->success($producto->load('categoria'));
    }

    public function productosUpdate(ProductoRequest $request, Producto $producto)
    {
        $producto->update($request->validated());
        return $this->success($producto->load('categoria'));
    }

    public function productosToggle(Producto $producto)
    {
        $producto->update(['activo' => !$producto->activo]);
        return $this->success($producto);
    }

    // ─────────────────────────────────────────────────────
    // CLIENTES
    // ─────────────────────────────────────────────────────

    public function clientesIndex(Request $request)
    {
        $query = Cliente::query();

        if ($s = $request->search) {
            $query->where(fn($q) => $q
                ->where('nombre', 'ilike', "%{$s}%")
                ->orWhere('email', 'ilike', "%{$s}%")
                ->orWhere('telefono', 'ilike', "%{$s}%")
                ->orWhere('direccion', 'ilike', "%{$s}%"));
        }
        if ($request->has('activo') && $request->activo !== '') $query->where('activo', $request->boolean('activo'));

        return $this->success($query->orderBy('nombre')->paginate($request->per_page ?? 10));
    }

    public function clientesStore(ClienteRequest $request)
    {
        return $this->created(Cliente::create($request->validated()));
    }

    public function clientesShow(Cliente $cliente)
    {
        return $this->success($cliente);
    }

    public function clientesUpdate(ClienteRequest $request, Cliente $cliente)
    {
        $cliente->update($request->validated());
        return $this->success($cliente);
    }

    public function clientesToggle(Cliente $cliente)
    {
        $cliente->update(['activo' => !$cliente->activo]);
        return $this->success($cliente);
    }

    public function clientesAll()
    {
        return $this->success(Cliente::activos()->orderBy('nombre')->get(['id', 'nombre']));
    }

    // ─────────────────────────────────────────────────────
    // PEDIDOS
    // ─────────────────────────────────────────────────────

    public function pedidosIndex(Request $request)
    {
        $query = Pedido::with(['cliente', 'estado', 'usuario']);

        if ($s = $request->search) {
            $query->where(fn($q) => $q
                ->where('id', 'ilike', "%{$s}%")
                ->orWhereHas('cliente', fn($q2) => $q2->where('nombre', 'ilike', "%{$s}%")));
        }
        if ($request->estado_id) $query->where('estado_id', $request->estado_id);
        if ($request->desde) $query->whereDate('created_at', '>=', $request->desde);
        if ($request->hasta) $query->whereDate('created_at', '<=', $request->hasta);

        return $this->success($query->orderByDesc('created_at')->paginate($request->per_page ?? 10));
    }

    public function pedidosStore(PedidoRequest $request)
    {
        $pedido = $this->pedidoService->crearPedido($request->validated(), $request->user()->id);
        return $this->created($pedido);
    }

    public function pedidosShow(Pedido $pedido)
    {
        $pedido->load(['cliente', 'estado', 'usuario', 'detalles.producto', 'pagos.usuario', 'historial.usuario', 'historial.estadoAnterior', 'historial.estadoNuevo']);

        $productosEnPedido = $pedido->detalles->pluck('producto_id')->toArray();
        $productosDisponibles = Producto::activos()->conStock()->whereNotIn('id', $productosEnPedido)->orderBy('nombre')->get(['id', 'nombre', 'precio', 'stock']);

        return $this->success([
            'pedido' => $pedido,
            'total_pagado' => $pedido->totalPagado(),
            'saldo_pendiente' => $pedido->saldoPendiente(),
            'productos_disponibles' => $productosDisponibles,
        ]);
    }

    public function pedidosCambiarEstado(Request $request, Pedido $pedido)
    {
        $request->validate(['estado_id' => 'required|exists:estados_pedido,id', 'comentario' => 'nullable|string|max:255']);
        $pedido = $this->pedidoService->cambiarEstado($pedido, $request->estado_id, $request->user()->id, $request->comentario);
        return $this->success($pedido);
    }

    public function pedidosAgregarDetalle(Request $request, Pedido $pedido)
    {
        $request->validate(['producto_id' => 'required|exists:productos,id', 'cantidad' => 'required|integer|min:1']);
        $pedido = $this->pedidoService->agregarDetalle($pedido, $request->only(['producto_id', 'cantidad']), $request->user()->id);
        return $this->success($pedido);
    }

    public function pedidosActualizarCantidad(Request $request, Pedido $pedido, int $detalle)
    {
        $request->validate(['cantidad' => 'required|integer|min:1']);
        $pedido = $this->pedidoService->actualizarCantidad($pedido, $detalle, $request->cantidad, $request->user()->id);
        return $this->success($pedido);
    }

    public function pedidosEliminarDetalle(Pedido $pedido, int $detalle)
    {
        $pedido = $this->pedidoService->eliminarDetalle($pedido, $detalle, request()->user()->id);
        return $this->success($pedido);
    }

    public function pedidosEstados()
    {
        return $this->success(EstadoPedido::all());
    }

    // ─────────────────────────────────────────────────────
    // PAGOS
    // ─────────────────────────────────────────────────────

    public function pagosIndex(Request $request)
    {
        $query = Pago::with(['pedido.cliente', 'usuario']);

        if ($s = $request->search) {
            $query->where(fn($q) => $q
                ->where('referencia', 'ilike', "%{$s}%")
                ->orWhereHas('pedido', fn($q2) => $q2->where('id', 'ilike', "%{$s}%"))
                ->orWhereHas('pedido.cliente', fn($q2) => $q2->where('nombre', 'ilike', "%{$s}%")));
        }
        if ($request->metodo_pago) $query->where('metodo_pago', $request->metodo_pago);
        if ($request->estado) $query->where('estado', $request->estado);
        if ($request->desde) $query->whereDate('created_at', '>=', $request->desde);
        if ($request->hasta) $query->whereDate('created_at', '<=', $request->hasta);

        return $this->success($query->orderByDesc('created_at')->paginate($request->per_page ?? 10));
    }

    public function pagosStore(PagoRequest $request)
    {
        $pago = $this->pagoService->registrarPago($request->validated(), $request->user()->id);
        return $this->created($pago);
    }

    public function pagosAnular(Pago $pago)
    {
        return $this->success($this->pagoService->anularPago($pago));
    }

    public function pagosConSaldo()
    {
        $pedidos = Pedido::with('cliente', 'estado')
            ->whereHas('estado', fn($q) => $q->where('nombre', '!=', 'cancelado'))
            ->orderByDesc('created_at')->get()
            ->map(fn($p) => ['id' => $p->id, 'cliente_nombre' => $p->cliente->nombre, 'total' => $p->total, 'saldo_pendiente' => $p->saldoPendiente(), 'estado' => $p->estado->nombre])
            ->filter(fn($p) => $p['saldo_pendiente'] > 0)->values();

        return $this->success($pedidos);
    }

    // ─────────────────────────────────────────────────────
    // HISTORIAL
    // ─────────────────────────────────────────────────────

    public function historialIndex(Request $request)
    {
        $query = HistorialPedido::with(['pedido.cliente', 'usuario', 'estadoAnterior', 'estadoNuevo']);

        if ($s = $request->search) {
            $query->where(fn($q) => $q
                ->whereHas('pedido', fn($q2) => $q2->where('id', 'ilike', "%{$s}%"))
                ->orWhereHas('pedido.cliente', fn($q2) => $q2->where('nombre', 'ilike', "%{$s}%"))
                ->orWhere('comentario', 'ilike', "%{$s}%"));
        }
        if ($request->estado_id) $query->where('estado_nuevo_id', $request->estado_id);
        if ($request->user_id) $query->where('user_id', $request->user_id);
        if ($request->pedido_id) $query->where('pedido_id', $request->pedido_id);
        if ($request->desde) $query->whereDate('created_at', '>=', $request->desde);
        if ($request->hasta) $query->whereDate('created_at', '<=', $request->hasta);

        return $this->success($query->orderByDesc('created_at')->paginate($request->per_page ?? 15));
    }

    // ─────────────────────────────────────────────────────
    // INVENTARIO
    // ─────────────────────────────────────────────────────

    public function inventarioIndex(Request $request)
    {
        $umbral = (int) ($request->umbral ?? 10);
        $query = Producto::with('categoria')->where('activo', true);

        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('nombre', 'ilike', "%{$s}%")->orWhereHas('categoria', fn($q2) => $q2->where('nombre', 'ilike', "%{$s}%")));
        }

        $nivel = $request->nivel ?? '';
        if ($nivel === 'sin_stock') $query->where('stock', 0);
        elseif ($nivel === 'bajo') $query->where('stock', '>', 0)->where('stock', '<=', $umbral);
        elseif ($nivel === 'normal') $query->where('stock', '>', $umbral);

        return $this->success([
            'productos' => $query->orderBy('stock')->paginate($request->per_page ?? 15),
            'resumen' => [
                'total' => Producto::where('activo', true)->count(),
                'sin_stock' => Producto::where('activo', true)->where('stock', 0)->count(),
                'stock_bajo' => Producto::where('activo', true)->where('stock', '>', 0)->where('stock', '<=', $umbral)->count(),
                'stock_normal' => Producto::where('activo', true)->where('stock', '>', $umbral)->count(),
                'valor_inventario' => round((float) (Producto::where('activo', true)->selectRaw('SUM(precio * stock) as v')->value('v') ?? 0), 2),
            ],
            'umbral' => $umbral,
        ]);
    }

    public function inventarioAjustar(Request $request, Producto $producto)
    {
        $request->validate(['tipo' => 'required|in:entrada,salida,ajuste', 'cantidad' => 'required|integer|min:1']);

        $tipo = $request->tipo;
        $cantidad = $request->cantidad;

        if ($tipo === 'entrada') $producto->increment('stock', $cantidad);
        elseif ($tipo === 'salida') {
            if ($producto->stock < $cantidad) return $this->error("Stock insuficiente. Disponible: {$producto->stock}.", 422);
            $producto->decrement('stock', $cantidad);
        } else {
            $producto->update(['stock' => $cantidad]);
        }

        return $this->success($producto->fresh()->load('categoria'));
    }

    // ─────────────────────────────────────────────────────
    // DASHBOARD
    // ─────────────────────────────────────────────────────

    public function dashboard()
    {
        $hoy = Carbon::today();
        $inicioMes = Carbon::now()->startOfMonth();
        $inicioSemana = Carbon::now()->startOfWeek();

        $ventas7Dias = collect(range(6, 0))->map(function ($i) {
            $fecha = Carbon::today()->subDays($i);
            return [
                'fecha' => $fecha->format('d/m'),
                'dia' => $fecha->locale('es')->isoFormat('ddd'),
                'total' => round((float) Pago::where('estado', 'confirmado')->whereDate('created_at', $fecha)->sum('monto'), 2),
            ];
        });

        $ventasMensuales = collect(range(5, 0))->map(function ($i) {
            $mes = Carbon::now()->subMonths($i);
            return [
                'mes' => $mes->locale('es')->isoFormat('MMM YYYY'),
                'total' => round((float) Pago::where('estado', 'confirmado')->whereYear('created_at', $mes->year)->whereMonth('created_at', $mes->month)->sum('monto'), 2),
            ];
        });

        return $this->success([
            'metricas' => [
                'total_productos' => Producto::where('activo', true)->count(),
                'total_clientes' => Cliente::where('activo', true)->count(),
                'total_pedidos' => Pedido::count(),
                'ingresos_mes' => round((float) Pago::where('estado', 'confirmado')->whereDate('created_at', '>=', $inicioMes)->sum('monto'), 2),
                'pedidos_hoy' => Pedido::whereDate('created_at', $hoy)->count(),
                'pedidos_semana' => Pedido::whereDate('created_at', '>=', $inicioSemana)->count(),
                'ingresos_hoy' => round((float) Pago::where('estado', 'confirmado')->whereDate('created_at', $hoy)->sum('monto'), 2),
            ],
            'pedidos_por_estado' => Pedido::join('estados_pedido', 'pedidos.estado_id', '=', 'estados_pedido.id')
                ->select('estados_pedido.nombre as estado', DB::raw('count(*) as total'))
                ->groupBy('estados_pedido.nombre')->get(),
            'ventas_7_dias' => $ventas7Dias,
            'ventas_mensuales' => $ventasMensuales,
            'top_productos' => DB::table('pedido_detalle')
                ->join('productos', 'pedido_detalle.producto_id', '=', 'productos.id')
                ->select('productos.nombre', DB::raw('SUM(pedido_detalle.cantidad) as total_vendido'), DB::raw('SUM(pedido_detalle.subtotal) as total_ingresos'))
                ->groupBy('productos.id', 'productos.nombre')
                ->orderByDesc('total_vendido')->limit(5)->get(),
            'top_clientes' => Pedido::join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
                ->select('clientes.nombre', DB::raw('COUNT(pedidos.id) as total_pedidos'), DB::raw('SUM(pedidos.total) as total_compras'))
                ->groupBy('clientes.id', 'clientes.nombre')
                ->orderByDesc('total_compras')->limit(5)->get(),
            'pedidos_recientes' => Pedido::with(['cliente', 'estado'])->orderByDesc('created_at')->limit(5)->get(),
            'alertas_stock' => [
                'sin_stock' => Producto::where('activo', true)->where('stock', 0)->orderBy('nombre')->limit(5)->get(['id', 'nombre', 'stock']),
                'stock_bajo' => Producto::where('activo', true)->where('stock', '>', 0)->where('stock', '<=', 10)->orderBy('stock')->limit(5)->get(['id', 'nombre', 'stock']),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────
    // USUARIOS (solo admin)
    // ─────────────────────────────────────────────────────

    public function usuariosIndex()
    {
        $usuarios = User::with('roles')->orderBy('name')->get();
        return $this->success($usuarios->map(fn($u) => $this->formatUser($u)));
    }

    // ─────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────

    private function formatUser($user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'created_at' => $user->created_at,
        ];
    }
}