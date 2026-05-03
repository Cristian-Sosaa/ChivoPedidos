<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $clienteId = $this->route('cliente')?->id;

        return [
            'nombre' => ['required', 'string', 'max:150'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('clientes', 'email')->ignore($clienteId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del cliente es obligatorio.',
            'nombre.max' => 'El nombre no puede superar los 150 caracteres.',
            'telefono.max' => 'El teléfono no puede superar los 20 caracteres.',
            'direccion.max' => 'La dirección no puede superar los 255 caracteres.',
            'email.email' => 'El correo electrónico no es válido.',
            'email.max' => 'El correo no puede superar los 150 caracteres.',
            'email.unique' => 'Ya existe un cliente con este correo electrónico.',
        ];
    }
}