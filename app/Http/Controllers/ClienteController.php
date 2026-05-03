<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Http\Requests\ClienteRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $query = Cliente::query();

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%")
                  ->orWhere('telefono', 'ilike', "%{$search}%")
                  ->orWhere('direccion', 'ilike', "%{$search}%");
            });
        }

        // Filtro por estado
        if ($request->has('activo') && $request->input('activo') !== '') {
            $query->where('activo', $request->boolean('activo'));
        }

        $clientes = $query->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Clientes/Form');
    }

    public function store(ClienteRequest $request)
    {
        Cliente::create($request->validated());

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente creado exitosamente.');
    }

    public function edit(Cliente $cliente)
    {
        return Inertia::render('Clientes/Form', [
            'cliente' => $cliente,
        ]);
    }

    public function update(ClienteRequest $request, Cliente $cliente)
    {
        $cliente->update($request->validated());

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente actualizado exitosamente.');
    }

    public function toggleActive(Cliente $cliente)
    {
        $cliente->update(['activo' => !$cliente->activo]);

        $estado = $cliente->activo ? 'activado' : 'desactivado';

        return back()->with('success', "Cliente {$estado} exitosamente.");
    }
}