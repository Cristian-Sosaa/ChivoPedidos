<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pedido_id' => ['required', 'exists:pedidos,id'],
            'monto' => ['required', 'numeric', 'min:0.01'],
            'metodo_pago' => ['required', 'string', 'in:efectivo,tarjeta,transferencia,cheque,otro'],
            'referencia' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'pedido_id.required' => 'Debés seleccionar un pedido.',
            'pedido_id.exists' => 'El pedido seleccionado no es válido.',
            'monto.required' => 'El monto es obligatorio.',
            'monto.numeric' => 'El monto debe ser un número válido.',
            'monto.min' => 'El monto debe ser mayor a $0.00.',
            'metodo_pago.required' => 'Debés seleccionar un método de pago.',
            'metodo_pago.in' => 'El método de pago no es válido.',
            'referencia.max' => 'La referencia no puede superar los 100 caracteres.',
        ];
    }
}