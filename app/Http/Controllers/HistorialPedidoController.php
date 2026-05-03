<?php

namespace App\Http\Controllers;

use App\Models\HistorialPedido;
use App\Models\EstadoPedido;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistorialPedidoController extends Controller
{
    public function index(Request $request)
    {
        $query = HistorialPedido::with([
            'pedido.cliente',
            'usuario',
            'estadoAnterior',
            'estadoNuevo',
        ]);

        // Búsqueda por # pedido o cliente
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('pedido', function ($q2) use ($search) {
                    $q2->where('id', 'ilike', "%{$search}%");
                })
                ->orWhereHas('pedido.cliente', function ($q2) use ($search) {
                    $q2->where('nombre', 'ilike', "%{$search}%");
                })
                ->orWhere('comentario', 'ilike', "%{$search}%");
            });
        }

        // Filtro por estado nuevo
        if ($estadoId = $request->input('estado_id')) {
            $query->where('estado_nuevo_id', $estadoId);
        }

        // Filtro por usuario
        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        // Filtro por pedido específico
        if ($pedidoId = $request->input('pedido_id')) {
            $query->where('pedido_id', $pedidoId);
        }

        // Filtro por fecha
        if ($desde = $request->input('desde')) {
            $query->whereDate('created_at', '>=', $desde);
        }
        if ($hasta = $request->input('hasta')) {
            $query->whereDate('created_at', '<=', $hasta);
        }

        $historial = $query->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $estados = EstadoPedido::all();
        $usuarios = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Historial/Index', [
            'historial' => $historial,
            'estados' => $estados,
            'usuarios' => $usuarios,
            'filters' => $request->only(['search', 'estado_id', 'user_id', 'pedido_id', 'desde', 'hasta']),
        ]);
    }
}