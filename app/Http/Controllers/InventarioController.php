<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventarioController extends Controller
{
    public function index(Request $request)
    {
        $umbral = (int) $request->input('umbral', 10);

        $query = Producto::with('categoria')->where('activo', true);

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'ilike', "%{$search}%")
                  ->orWhereHas('categoria', function ($q2) use ($search) {
                      $q2->where('nombre', 'ilike', "%{$search}%");
                  });
            });
        }

        // Filtro de nivel de stock
        $nivel = $request->input('nivel', '');
        if ($nivel === 'sin_stock') {
            $query->where('stock', 0);
        } elseif ($nivel === 'bajo') {
            $query->where('stock', '>', 0)->where('stock', '<=', $umbral);
        } elseif ($nivel === 'normal') {
            $query->where('stock', '>', $umbral);
        }

        $productos = $query->orderBy('stock', 'asc')
            ->paginate(15)
            ->withQueryString();

        // Resumen general
        $totalProductos = Producto::where('activo', true)->count();
        $sinStock = Producto::where('activo', true)->where('stock', 0)->count();
        $stockBajo = Producto::where('activo', true)->where('stock', '>', 0)->where('stock', '<=', $umbral)->count();
        $stockNormal = Producto::where('activo', true)->where('stock', '>', $umbral)->count();
        $valorInventario = Producto::where('activo', true)
            ->selectRaw('SUM(precio * stock) as valor')
            ->value('valor') ?? 0;

        return Inertia::render('Inventario/Index', [
            'productos' => $productos,
            'resumen' => [
                'total' => $totalProductos,
                'sin_stock' => $sinStock,
                'stock_bajo' => $stockBajo,
                'stock_normal' => $stockNormal,
                'valor_inventario' => round((float) $valorInventario, 2),
            ],
            'umbral' => $umbral,
            'filters' => $request->only(['search', 'nivel', 'umbral']),
        ]);
    }

    public function ajustarStock(Request $request, Producto $producto)
    {
        $request->validate([
            'tipo' => ['required', 'in:entrada,salida,ajuste'],
            'cantidad' => ['required', 'integer', 'min:1'],
        ]);

        $tipo = $request->input('tipo');
        $cantidad = $request->input('cantidad');

        if ($tipo === 'entrada') {
            $producto->increment('stock', $cantidad);
            $mensaje = "Se agregaron {$cantidad} unidades a \"{$producto->nombre}\".";
        } elseif ($tipo === 'salida') {
            if ($producto->stock < $cantidad) {
                return back()->with('error', "Stock insuficiente. Disponible: {$producto->stock}.");
            }
            $producto->decrement('stock', $cantidad);
            $mensaje = "Se retiraron {$cantidad} unidades de \"{$producto->nombre}\".";
        } else {
            $producto->update(['stock' => $cantidad]);
            $mensaje = "Stock de \"{$producto->nombre}\" ajustado a {$cantidad} unidades.";
        }

        return back()->with('success', $mensaje);
    }
}