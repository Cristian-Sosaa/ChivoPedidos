<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use App\Models\Pedido;
use App\Http\Requests\PagoRequest;
use App\Services\PagoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PagoController extends Controller
{
    public function __construct(
        private PagoService $pagoService
    ) {}

    public function index(Request $request)
    {
        $query = Pago::with(['pedido.cliente', 'usuario']);

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('referencia', 'ilike', "%{$search}%")
                  ->orWhere('id', 'ilike', "%{$search}%")
                  ->orWhereHas('pedido', function ($q2) use ($search) {
                      $q2->where('id', 'ilike', "%{$search}%");
                  })
                  ->orWhereHas('pedido.cliente', function ($q2) use ($search) {
                      $q2->where('nombre', 'ilike', "%{$search}%");
                  });
            });
        }

        // Filtro por método de pago
        if ($metodo = $request->input('metodo_pago')) {
            $query->where('metodo_pago', $metodo);
        }

        // Filtro por estado
        if ($estado = $request->input('estado')) {
            $query->where('estado', $estado);
        }

        // Filtro por fecha
        if ($desde = $request->input('desde')) {
            $query->whereDate('created_at', '>=', $desde);
        }
        if ($hasta = $request->input('hasta')) {
            $query->whereDate('created_at', '<=', $hasta);
        }

        $pagos = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Pagos/Index', [
            'pagos' => $pagos,
            'filters' => $request->only(['search', 'metodo_pago', 'estado', 'desde', 'hasta']),
        ]);
    }

    public function create(Request $request)
    {
        $pedidoId = $request->query('pedido_id');
        $pedido = null;

        if ($pedidoId) {
            $pedido = Pedido::with('cliente', 'estado')->findOrFail($pedidoId);
            $pedido->saldo_pendiente = $pedido->saldoPendiente();
        }

        // Pedidos con saldo pendiente (no cancelados)
        $pedidos = Pedido::with('cliente', 'estado')
            ->whereHas('estado', fn ($q) => $q->where('nombre', '!=', 'cancelado'))
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                $saldo = $p->saldoPendiente();
                return [
                    'id' => $p->id,
                    'cliente_nombre' => $p->cliente->nombre,
                    'total' => $p->total,
                    'saldo_pendiente' => $saldo,
                    'estado' => $p->estado->nombre,
                ];
            })
            ->filter(fn ($p) => $p['saldo_pendiente'] > 0)
            ->values();

        return Inertia::render('Pagos/Form', [
            'pedidos' => $pedidos,
            'pedidoSeleccionado' => $pedido,
        ]);
    }

    public function store(PagoRequest $request)
    {
        $this->pagoService->registrarPago(
            $request->validated(),
            $request->user()->id
        );

        return redirect()->route('pagos.index')
            ->with('success', 'Pago registrado exitosamente.');
    }

    public function anular(Pago $pago)
    {
        $this->pagoService->anularPago($pago);

        return back()->with('success', 'Pago anulado exitosamente.');
    }
}