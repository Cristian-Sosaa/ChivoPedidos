<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\EstadoPedido;
use App\Http\Requests\PedidoRequest;
use App\Services\PedidoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PedidoController extends Controller
{
    public function __construct(
        private PedidoService $pedidoService
    ) {}

    public function index(Request $request)
    {
        $query = Pedido::with(['cliente', 'estado', 'usuario']);

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'ilike', "%{$search}%")
                  ->orWhereHas('cliente', function ($q2) use ($search) {
                      $q2->where('nombre', 'ilike', "%{$search}%");
                  });
            });
        }

        // Filtro por estado
        if ($estadoId = $request->input('estado_id')) {
            $query->where('estado_id', $estadoId);
        }

        // Filtro por fecha
        if ($desde = $request->input('desde')) {
            $query->whereDate('created_at', '>=', $desde);
        }
        if ($hasta = $request->input('hasta')) {
            $query->whereDate('created_at', '<=', $hasta);
        }

        $pedidos = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        $estados = EstadoPedido::all();

        return Inertia::render('Pedidos/Index', [
            'pedidos' => $pedidos,
            'estados' => $estados,
            'filters' => $request->only(['search', 'estado_id', 'desde', 'hasta']),
        ]);
    }

    public function create()
    {
        $clientes = Cliente::activos()->orderBy('nombre')->get(['id', 'nombre']);
        $productos = Producto::activos()->conStock()->orderBy('nombre')->get(['id', 'nombre', 'precio', 'stock']);
        $estados = EstadoPedido::all();

        return Inertia::render('Pedidos/Form', [
            'clientes' => $clientes,
            'productos' => $productos,
            'estados' => $estados,
        ]);
    }

    public function store(PedidoRequest $request)
    {
        $this->pedidoService->crearPedido(
            $request->validated(),
            $request->user()->id
        );

        return redirect()->route('pedidos.index')
            ->with('success', 'Pedido creado exitosamente.');
    }

    public function show(Pedido $pedido)
    {
        $pedido->load([
            'cliente',
            'estado',
            'usuario',
            'detalles.producto',
            'pagos.usuario',
            'historial.usuario',
            'historial.estadoAnterior',
            'historial.estadoNuevo',
        ]);

        $estados = EstadoPedido::all();

        $productosEnPedido = $pedido->detalles->pluck('producto_id')->toArray();
        $productosDisponibles = Producto::activos()
            ->conStock()
            ->whereNotIn('id', $productosEnPedido)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'precio', 'stock']);

        return Inertia::render('Pedidos/Show', [
            'pedido' => $pedido,
            'estados' => $estados,
            'totalPagado' => $pedido->totalPagado(),
            'saldoPendiente' => $pedido->saldoPendiente(),
            'productosDisponibles' => $productosDisponibles,
        ]);
    }

    public function cambiarEstado(Request $request, Pedido $pedido)
    {
        $request->validate([
            'estado_id' => ['required', 'exists:estados_pedido,id'],
            'comentario' => ['nullable', 'string', 'max:255'],
        ]);

        $this->pedidoService->cambiarEstado(
            $pedido,
            $request->input('estado_id'),
            $request->user()->id,
            $request->input('comentario')
        );

        return back()->with('success', 'Estado del pedido actualizado.');
    }

    public function agregarDetalle(Request $request, Pedido $pedido)
    {
        $request->validate([
            'producto_id' => ['required', 'exists:productos,id'],
            'cantidad' => ['required', 'integer', 'min:1'],
        ]);

        $this->pedidoService->agregarDetalle(
            $pedido,
            $request->only(['producto_id', 'cantidad']),
            $request->user()->id
        );

        return back()->with('success', 'Producto agregado al pedido.');
    }

    public function actualizarCantidad(Request $request, Pedido $pedido, int $detalle)
    {
        $request->validate([
            'cantidad' => ['required', 'integer', 'min:1'],
        ]);

        $this->pedidoService->actualizarCantidad(
            $pedido,
            $detalle,
            $request->input('cantidad'),
            $request->user()->id
        );

        return back()->with('success', 'Cantidad actualizada.');
    }

    public function eliminarDetalle(Pedido $pedido, int $detalle)
    {
        $this->pedidoService->eliminarDetalle(
            $pedido,
            $detalle,
            request()->user()->id
        );

        return back()->with('success', 'Producto eliminado del pedido.');
    }

    
}