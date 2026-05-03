<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Http\Requests\ProductoRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::with('categoria');

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'ilike', "%{$search}%")
                  ->orWhere('descripcion', 'ilike', "%{$search}%");
            });
        }

        // Filtro por categoría
        if ($categoriaId = $request->input('categoria_id')) {
            $query->where('categoria_id', $categoriaId);
        }

        // Filtro por estado
        if ($request->has('activo') && $request->input('activo') !== '') {
            $query->where('activo', $request->boolean('activo'));
        }

        // Filtro por stock bajo
        if ($request->boolean('bajo_stock')) {
            $query->bajoStock();
        }

        $productos = $query->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        $categorias = Categoria::activos()->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filters' => $request->only(['search', 'categoria_id', 'activo', 'bajo_stock']),
        ]);
    }

    public function create()
    {
        $categorias = Categoria::activos()->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('Productos/Form', [
            'categorias' => $categorias,
        ]);
    }

    public function store(ProductoRequest $request)
    {
        Producto::create($request->validated());

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Producto $producto)
    {
        $categorias = Categoria::activos()->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('Productos/Form', [
            'producto' => $producto,
            'categorias' => $categorias,
        ]);
    }

    public function update(ProductoRequest $request, Producto $producto)
    {
        $producto->update($request->validated());

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function toggleActive(Producto $producto)
    {
        $producto->update(['activo' => !$producto->activo]);

        $estado = $producto->activo ? 'activado' : 'desactivado';

        return back()->with('success', "Producto {$estado} exitosamente.");
    }
}