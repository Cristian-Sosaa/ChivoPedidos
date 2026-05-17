<?php

namespace App\Services;

use App\Models\Pago;
use App\Models\Pedido;
use Illuminate\Validation\ValidationException;

class PagoService
{
    public function registrarPago(array $data, int $userId): Pago
    {
        $pedido = Pedido::findOrFail($data['pedido_id']);
        $pedido->load('estado');

        if ($pedido->estado->nombre === 'cancelado') {
            throw ValidationException::withMessages([
                'pedido_id' => 'No se pueden registrar pagos en un pedido cancelado.',
            ]);
        }

        $saldoPendiente = $pedido->saldoPendiente();
        if ($data['monto'] > $saldoPendiente) {
            throw ValidationException::withMessages([
                'monto' => "El monto excede el saldo pendiente de \${$saldoPendiente}.",
            ]);
        }

        $pago = Pago::create([
            'pedido_id' => $pedido->id,
            'user_id' => $userId,
            'monto' => $data['monto'],
            'metodo_pago' => $data['metodo_pago'],
            'referencia' => $data['referencia'] ?? null,
            'estado' => 'confirmado',
        ]);

        return $pago->load(['pedido.cliente', 'usuario']);
    }

    public function anularPago(Pago $pago): Pago
    {
        if ($pago->estado === 'anulado') {
            throw ValidationException::withMessages([
                'pago' => 'Este pago ya fue anulado.',
            ]);
        }

        $pago->update(['estado' => 'anulado']);

        return $pago->load(['pedido.cliente', 'usuario']);
    }
}