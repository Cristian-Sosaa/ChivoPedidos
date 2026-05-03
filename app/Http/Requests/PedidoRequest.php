<?php

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;

class PedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cliente_id' => ['required', 'exists:clientes,id'],
            'estado_id' => ['required', 'exists:estados_pedido,id'],
            'observaciones' => ['nullable', 'string', 'max:255'],
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.producto_id' => ['required', 'exists:productos,id'],
            'detalles.*.cantidad' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'cliente_id.required' => 'Debés seleccionar un cliente.',
            'cliente_id.exists' => 'El cliente seleccionado no es válido.',
            'estado_id.required' => 'Debés seleccionar un estado.',
            'detalles.required' => 'Debés agregar al menos un producto al pedido.',
            'detalles.min' => 'Debés agregar al menos un producto al pedido.',
            'detalles.*.producto_id.required' => 'Seleccioná un producto.',
            'detalles.*.producto_id.exists' => 'El producto seleccionado no es válido.',
            'detalles.*.cantidad.required' => 'La cantidad es obligatoria.',
            'detalles.*.cantidad.min' => 'La cantidad mínima es 1.',
        ];
    }
}