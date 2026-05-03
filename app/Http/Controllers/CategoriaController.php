<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Http\Requests\CategoriaRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        $query = Categoria::query();

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'ilike', "%{$search}%")
                  ->orWhere('descripcion', 'ilike', "%{$search}%");
            });
        }

        // Filtro por estado
        if ($request->has('activo') && $request->input('activo') !== '') {
            $query->where('activo', $request->boolean('activo'));
        }

        $categorias = $query->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Categorias/Index', [
            'categorias' => $categorias,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Categorias/Form');
    }

    public function store(CategoriaRequest $request)
    {
        Categoria::create($request->validated());

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    public function edit(Categoria $categoria)
    {
        return Inertia::render('Categorias/Form', [
            'categoria' => $categoria,
        ]);
    }

    public function update(CategoriaRequest $request, Categoria $categoria)
    {
        $categoria->update($request->validated());

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    public function toggleActive(Categoria $categoria)
    {
        $categoria->update(['activo' => !$categoria->activo]);

        $estado = $categoria->activo ? 'activada' : 'desactivada';

        return back()->with('success', "Categoría {$estado} exitosamente.");
    }
}